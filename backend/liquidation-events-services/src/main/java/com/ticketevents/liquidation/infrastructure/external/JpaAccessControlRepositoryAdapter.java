package com.ticketevents.liquidation.infrastructure.external;

import com.ticketevents.liquidation.domain.entities.EstadoIngreso;
import com.ticketevents.liquidation.domain.entities.RegistroIngreso;
import com.ticketevents.liquidation.domain.entities.ResumenVentasEvento;
import com.ticketevents.liquidation.domain.repositories.AccessControlRepository;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.ExternalIdResolver;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.Module1HttpClient;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.Module2HttpClient;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.Module1EventSnapshotDto;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.CondicionDto;
import com.ticketevents.liquidation.infrastructure.mappers.Module1EventSnapshotMapper;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

@Repository
public class JpaAccessControlRepositoryAdapter implements AccessControlRepository {

    private final EntityManager entityManager;
    private final ExternalIdResolver externalIdResolver;
    private final Module1HttpClient module1HttpClient;
    private final Module2HttpClient module2HttpClient;
    private final JpaEventSnapshotRepositoryAdapter eventSnapshotRepositoryAdapter;
    private final Module1EventSnapshotMapper module1EventSnapshotMapper;
    private final boolean fallbackToJpa;

    public JpaAccessControlRepositoryAdapter(EntityManager entityManager,
                                             ExternalIdResolver externalIdResolver,
                                             ObjectProvider<Module1HttpClient> module1HttpClient,
                                             Module2HttpClient module2HttpClient,
                                             JpaEventSnapshotRepositoryAdapter eventSnapshotRepositoryAdapter,
                                             Module1EventSnapshotMapper module1EventSnapshotMapper,
                                             @Value("${external.module2.fallback-to-jpa:true}") boolean fallbackToJpa) {
        this.entityManager = entityManager;
        this.externalIdResolver = externalIdResolver;
        this.module1HttpClient = module1HttpClient.getIfAvailable();
        this.module2HttpClient = module2HttpClient;
        this.eventSnapshotRepositoryAdapter = eventSnapshotRepositoryAdapter;
        this.module1EventSnapshotMapper = module1EventSnapshotMapper;
        this.fallbackToJpa = fallbackToJpa;
    }

    @Override
    @Transactional
    public List<RegistroIngreso> getIngresosByEvento(Long eventoId) {
        Optional<String> externalEventId = externalIdResolver.resolveEventoExternalId(eventoId);
        if (module2HttpClient.isEnabled() && externalEventId.isPresent()) {
            try {
                List<RegistroIngreso> registros = getIngresosFromModule2(eventoId, externalEventId.get());
                if (!registros.isEmpty()) {
                    saveEstadoIngresoCache(eventoId, registros);
                    return registros;
                }
            } catch (RuntimeException ex) {
                if (!fallbackToJpa) {
                    throw ex;
                }
            }
        }
        return getIngresosFromLocalTickets(eventoId);
    }

    private List<RegistroIngreso> getIngresosFromModule2(Long eventoId, String externalEventId) {
        List<Module2HttpClient.AttendanceTicket> checkedTickets = module2HttpClient.getAttendanceTickets(externalEventId);
        List<String> soldTickets = getSoldExternalTickets(eventoId);
        if (soldTickets.isEmpty()) {
            Module1EventSnapshotDto snapshot = refreshSoldTicketsFromModule1(eventoId, externalEventId);
            soldTickets = getSoldExternalTickets(eventoId);
            if (soldTickets.isEmpty()) {
                return buildAggregatedAttendance(eventoId, checkedTickets, snapshot);
            }
        }

        if (soldTickets.isEmpty() && checkedTickets.isEmpty()) {
            return List.of();
        }

        Set<String> checkedIds = new HashSet<>();
        List<RegistroIngreso> registros = new java.util.ArrayList<>();
        for (Module2HttpClient.AttendanceTicket ticket : checkedTickets) {
            checkedIds.add(ticket.ticketId());
            registros.add(new RegistroIngreso(
                    ticket.ticketId(),
                    eventoId,
                    ticket.fechaHoraIngreso(),
                    EstadoIngreso.CHECKED_IN,
                    ticket.tipoAcceso()
            ));
        }

        for (String ticketId : soldTickets) {
            if (!checkedIds.contains(ticketId)) {
                registros.add(new RegistroIngreso(
                        ticketId,
                        eventoId,
                        null,
                        EstadoIngreso.NOT_ATTENDED,
                        null
                ));
            }
        }
        return registros;
    }

    private Module1EventSnapshotDto refreshSoldTicketsFromModule1(Long eventoId, String externalEventId) {
        if (module1HttpClient == null) {
            return null;
        }
        try {
            Module1EventSnapshotDto snapshot = module1HttpClient.getSnapshot(externalEventId);
            ResumenVentasEvento resumen = module1EventSnapshotMapper.map(snapshot, eventoId);
            eventSnapshotRepositoryAdapter.updateExternalSnapshotMetadata(eventoId, snapshot);
            eventSnapshotRepositoryAdapter.saveSnapshot(resumen);
            return snapshot;
        } catch (RuntimeException ignored) {
            if (!fallbackToJpa) {
                throw ignored;
            }
            return null;
        }
    }

    private List<RegistroIngreso> buildAggregatedAttendance(
            Long eventoId,
            List<Module2HttpClient.AttendanceTicket> checkedTickets,
            Module1EventSnapshotDto snapshot) {
        List<RegistroIngreso> registros = new java.util.ArrayList<>();
        for (Module2HttpClient.AttendanceTicket ticket : checkedTickets) {
            registros.add(new RegistroIngreso(
                    ticket.ticketId(),
                    eventoId,
                    ticket.fechaHoraIngreso(),
                    EstadoIngreso.CHECKED_IN,
                    ticket.tipoAcceso()
            ));
        }

        int totalVendidos = resolveTotalSoldTickets(eventoId, snapshot);
        int noAsistieron = Math.max(0, totalVendidos - checkedTickets.size());
        for (int i = 1; i <= noAsistieron; i++) {
            registros.add(new RegistroIngreso(
                    "NO-ASISTIO-" + i,
                    eventoId,
                    null,
                    EstadoIngreso.NOT_ATTENDED,
                    null
            ));
        }
        return registros;
    }

    private int resolveTotalSoldTickets(Long eventoId, Module1EventSnapshotDto snapshot) {
        int cached = getCachedSoldTicketCount(eventoId);
        if (cached > 0) {
            return cached;
        }
        if (snapshot == null || snapshot.getCondiciones() == null) {
            return 0;
        }
        int total = 0;
        for (CondicionDto condicion : snapshot.getCondiciones()) {
            if (condicion == null || !isAttendanceRelevantCondition(condicion.getCondicion())) {
                continue;
            }
            total += condicion.getCantidad();
        }
        return total;
    }

    private int getCachedSoldTicketCount(Long eventoId) {
        try {
            Object value = entityManager.createNativeQuery("""
                    SELECT COALESCE(SUM(cantidad), 0)
                    FROM resumen_ventas_cache
                    WHERE evento_id = :eventoId
                      AND condicion_liquidacion IN ('VENDIDO', 'VALIDADO')
                    """)
                    .setParameter("eventoId", eventoId)
                    .getSingleResult();
            return ((Number) value).intValue();
        } catch (RuntimeException ex) {
            return 0;
        }
    }

    private List<String> getSoldExternalTickets(Long eventoId) {
        ensureExternalTicketsTable();
        return entityManager.createNativeQuery("""
                SELECT ticket_externo_id
                FROM evento_tickets_externos
                WHERE evento_id = :eventoId
                  AND condicion_liquidacion IN ('VENDIDO', 'VALIDADO')
                """)
                .setParameter("eventoId", eventoId)
                .getResultList()
                .stream()
                .map(String::valueOf)
                .toList();
    }

    private List<RegistroIngreso> getIngresosFromLocalTickets(Long eventoId) {
        List<RegistroIngreso> cached = getEstadoIngresoCache(eventoId);
        if (!cached.isEmpty()) {
            return cached;
        }

        String sql = """
                SELECT t.id, t.evento_id, t.fecha_hora_ingreso, t.estado_ingreso, t.tipo_acceso
                FROM tickets t
                WHERE t.evento_id = :eventoId
                  AND t.estado_ingreso IS NOT NULL
                """;

        List<Object[]> rows = entityManager.createNativeQuery(sql)
                .setParameter("eventoId", eventoId)
                .getResultList();

        List<RegistroIngreso> localTickets = rows.stream().map(row -> new RegistroIngreso(
                String.valueOf(row[0]),
                ((Number) row[1]).longValue(),
                toLocalDateTime(row[2]),
                EstadoIngreso.valueOf(String.valueOf(row[3])),
                row[4] != null ? String.valueOf(row[4]) : null
        )).toList();
        if (!localTickets.isEmpty()) {
            return localTickets;
        }

        Module1EventSnapshotDto snapshot = null;
        Optional<String> externalEventId = externalIdResolver.resolveEventoExternalId(eventoId);
        if (externalEventId.isPresent()) {
            snapshot = refreshSoldTicketsFromModule1(eventoId, externalEventId.get());
        }
        List<RegistroIngreso> aggregated = buildAggregatedAttendance(eventoId, List.of(), snapshot);
        if (!aggregated.isEmpty()) {
            saveEstadoIngresoCache(eventoId, aggregated);
        }
        return aggregated;
    }

    private void saveEstadoIngresoCache(Long eventoId, List<RegistroIngreso> registros) {
        ensureEstadoIngresoCacheTable();
        entityManager.createNativeQuery("""
                DELETE FROM estado_ingreso_cache
                WHERE evento_id = :eventoId
                """)
                .setParameter("eventoId", eventoId)
                .executeUpdate();

        for (RegistroIngreso registro : registros) {
            if (registro == null || registro.getIdTicket() == null || registro.getEstadoIngreso() == null) {
                continue;
            }
            entityManager.createNativeQuery("""
                    INSERT INTO estado_ingreso_cache (
                        evento_id, ticket_id, estado_ingreso, tipo_acceso, fecha_hora_ingreso, fecha_sincronizacion
                    )
                    VALUES (:eventoId, :ticketId, :estadoIngreso, :tipoAcceso, :fechaHoraIngreso, CURRENT_TIMESTAMP)
                    ON CONFLICT (evento_id, ticket_id) DO UPDATE
                    SET estado_ingreso = EXCLUDED.estado_ingreso,
                        tipo_acceso = EXCLUDED.tipo_acceso,
                        fecha_hora_ingreso = EXCLUDED.fecha_hora_ingreso,
                        fecha_sincronizacion = CURRENT_TIMESTAMP
                    """)
                    .setParameter("eventoId", eventoId)
                    .setParameter("ticketId", registro.getIdTicket())
                    .setParameter("estadoIngreso", registro.getEstadoIngreso().name())
                    .setParameter("tipoAcceso", registro.getTipoAcceso())
                    .setParameter("fechaHoraIngreso", registro.getFechaHoraIngreso())
                    .executeUpdate();
        }
    }

    private List<RegistroIngreso> getEstadoIngresoCache(Long eventoId) {
        ensureEstadoIngresoCacheTable();
        List<Object[]> rows = entityManager.createNativeQuery("""
                SELECT ticket_id, evento_id, fecha_hora_ingreso, estado_ingreso, tipo_acceso
                FROM estado_ingreso_cache
                WHERE evento_id = :eventoId
                ORDER BY ticket_id
                """)
                .setParameter("eventoId", eventoId)
                .getResultList();

        return rows.stream().map(row -> new RegistroIngreso(
                String.valueOf(row[0]),
                ((Number) row[1]).longValue(),
                toLocalDateTime(row[2]),
                EstadoIngreso.valueOf(String.valueOf(row[3])),
                row[4] != null ? String.valueOf(row[4]) : null
        )).toList();
    }

    private void ensureExternalTicketsTable() {
        entityManager.createNativeQuery("""
                CREATE TABLE IF NOT EXISTS evento_tickets_externos (
                    evento_id BIGINT NOT NULL,
                    ticket_externo_id VARCHAR(64) NOT NULL,
                    condicion_liquidacion VARCHAR(32) NOT NULL,
                    precio NUMERIC(14,2) NOT NULL DEFAULT 0,
                    fecha_sincronizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (evento_id, ticket_externo_id)
                )
                """).executeUpdate();
    }

    private void ensureEstadoIngresoCacheTable() {
        entityManager.createNativeQuery("""
                CREATE TABLE IF NOT EXISTS estado_ingreso_cache (
                    evento_id BIGINT NOT NULL,
                    ticket_id VARCHAR(64) NOT NULL,
                    estado_ingreso VARCHAR(32) NOT NULL,
                    tipo_acceso VARCHAR(64),
                    fecha_hora_ingreso TIMESTAMP,
                    fecha_sincronizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (evento_id, ticket_id)
                )
                """).executeUpdate();
    }

    private boolean isAttendanceRelevantCondition(String condicion) {
        if (condicion == null) {
            return false;
        }
        String normalized = condicion.trim().toUpperCase();
        return "VENDIDO".equals(normalized)
                || "VALIDADO".equals(normalized)
                || "VALIDADO_CHECKIN".equals(normalized)
                || "VENDIDO_SIN_ASISTENCIA".equals(normalized)
                || "VENDIDO_SINASISTENCIA".equals(normalized);
    }

    private LocalDateTime toLocalDateTime(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof LocalDateTime localDateTime) {
            return localDateTime;
        }
        if (value instanceof java.sql.Timestamp timestamp) {
            return timestamp.toLocalDateTime();
        }
        return LocalDateTime.parse(String.valueOf(value));
    }
}

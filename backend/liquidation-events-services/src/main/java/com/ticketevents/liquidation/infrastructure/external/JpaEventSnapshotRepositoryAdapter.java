package com.ticketevents.liquidation.infrastructure.external;

import com.ticketevents.liquidation.domain.entities.CondicionLiquidacion;
import com.ticketevents.liquidation.domain.entities.ResumenVentasEvento;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.CondicionDto;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.Module1EventSnapshotDto;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.TicketDto;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class JpaEventSnapshotRepositoryAdapter {

    private final EntityManager entityManager;

    public JpaEventSnapshotRepositoryAdapter(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<EventoMetadata> findEventoMetadata(Long eventoId) {
        if (eventoId == null) {
            return Optional.empty();
        }
        String eventoSql = "SELECT e.nombre, e.estado FROM eventos e WHERE e.id = :eventoId";
        Object[] row = (Object[]) entityManager.createNativeQuery(eventoSql)
                .setParameter("eventoId", eventoId)
                .getResultStream()
                .findFirst()
                .orElse(null);
        if (row == null) {
            return Optional.empty();
        }
        return Optional.of(new EventoMetadata(String.valueOf(row[0]), String.valueOf(row[1])));
    }

    public ResumenVentasEvento getSnapshot(Long eventoId) {
        Optional<EventoMetadata> metadata = findEventoMetadata(eventoId);
        if (metadata.isEmpty()) {
            return null;
        }

        Optional<ResumenVentasEvento> cached = findCachedSnapshot(eventoId, metadata.get());
        if (cached.isPresent()) {
            return cached.get();
        }

        String resumenSql = """
                SELECT t.condicion_liquidacion, COUNT(*), COALESCE(SUM(t.valor_liquidacion),0)
                FROM tickets t
                WHERE t.evento_id = :eventoId
                GROUP BY t.condicion_liquidacion
                """;
        var rows = entityManager.createNativeQuery(resumenSql)
                .setParameter("eventoId", eventoId)
                .getResultList();

        if (rows.isEmpty()) {
            return null;
        }

        Map<CondicionLiquidacion, Integer> tickets = new EnumMap<>(CondicionLiquidacion.class);
        Map<CondicionLiquidacion, BigDecimal> recaudo = new EnumMap<>(CondicionLiquidacion.class);
        for (Object rowObj : rows) {
            Object[] row = (Object[]) rowObj;
            CondicionLiquidacion condicion = CondicionLiquidacion.valueOf(String.valueOf(row[0]));
            tickets.put(condicion, ((Number) row[1]).intValue());
            recaudo.put(condicion, (BigDecimal) row[2]);
        }

        for (CondicionLiquidacion c : CondicionLiquidacion.values()) {
            tickets.putIfAbsent(c, 0);
            recaudo.putIfAbsent(c, BigDecimal.ZERO);
        }

        BigDecimal total = recaudo.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        ResumenVentasEvento out = new ResumenVentasEvento();
        out.setIdEvento(eventoId);
        out.setNombreEvento(metadata.get().nombre());
        out.setEstadoEvento(metadata.get().estado());
        out.setTicketsPorCondicion(tickets);
        out.setRecaudoPorCondicion(recaudo);
        out.setTotalRecaudoBruto(total);
        return out;
    }

    @Transactional
    public void saveSnapshot(ResumenVentasEvento snapshot) {
        if (snapshot == null || snapshot.getIdEvento() == null) {
            return;
        }

        ensureSnapshotCacheTable();
        entityManager.createNativeQuery("""
                DELETE FROM resumen_ventas_cache
                WHERE evento_id = :eventoId
                """)
                .setParameter("eventoId", snapshot.getIdEvento())
                .executeUpdate();

        for (CondicionLiquidacion condicion : CondicionLiquidacion.values()) {
            Integer cantidad = snapshot.getTicketsPorCondicion().getOrDefault(condicion, 0);
            BigDecimal valorTotal = snapshot.getRecaudoPorCondicion().getOrDefault(condicion, BigDecimal.ZERO);
            entityManager.createNativeQuery("""
                    INSERT INTO resumen_ventas_cache (
                        evento_id, condicion_liquidacion, cantidad, valor_total, fecha_sincronizacion
                    )
                    VALUES (:eventoId, :condicion, :cantidad, :valorTotal, CURRENT_TIMESTAMP)
                    """)
                    .setParameter("eventoId", snapshot.getIdEvento())
                    .setParameter("condicion", condicion.name())
                    .setParameter("cantidad", cantidad)
                    .setParameter("valorTotal", valorTotal)
                    .executeUpdate();
        }
    }

    @Transactional
    public void updateExternalSnapshotMetadata(Long eventoId, Module1EventSnapshotDto dto) {
        if (eventoId == null || dto == null) {
            return;
        }

        ensureEventosExternosTipoRecintoColumn();
        entityManager.createNativeQuery("""
                UPDATE eventos_externos
                SET recinto_externo_id = COALESCE(:recintoId, recinto_externo_id),
                    nombre_recinto = COALESCE(:nombreRecinto, nombre_recinto),
                    tipo_recinto = COALESCE(:tipoRecinto, tipo_recinto),
                    fecha_sincronizacion = CURRENT_TIMESTAMP
                WHERE evento_local_id = :eventoId
                """)
                .setParameter("eventoId", eventoId)
                .setParameter("recintoId", blankToNull(dto.getRecintoId()))
                .setParameter("nombreRecinto", blankToNull(dto.getNombreRecinto()))
                .setParameter("tipoRecinto", blankToNull(dto.getTipoRecinto()))
                .executeUpdate();

        saveExternalTickets(eventoId, dto);
    }

    @Transactional
    public void saveExternalTickets(Long eventoId, Module1EventSnapshotDto dto) {
        if (eventoId == null || dto == null || dto.getCondiciones() == null) {
            return;
        }

        ensureExternalTicketsTable();
        entityManager.createNativeQuery("""
                DELETE FROM evento_tickets_externos
                WHERE evento_id = :eventoId
                """)
                .setParameter("eventoId", eventoId)
                .executeUpdate();

        for (CondicionDto condicion : dto.getCondiciones()) {
            if (condicion == null || condicion.getTickets() == null) {
                continue;
            }
            String condicionNormalizada = condicion.getCondicion() == null ? "VENDIDO" : condicion.getCondicion();
            for (TicketDto ticket : condicion.getTickets()) {
                if (ticket == null || ticket.getTicketId() == null || ticket.getTicketId().isBlank()) {
                    continue;
                }
                entityManager.createNativeQuery("""
                        INSERT INTO evento_tickets_externos (
                            evento_id, ticket_externo_id, condicion_liquidacion, precio, fecha_sincronizacion
                        )
                        VALUES (:eventoId, :ticketId, :condicion, :precio, CURRENT_TIMESTAMP)
                        ON CONFLICT (evento_id, ticket_externo_id) DO UPDATE
                        SET condicion_liquidacion = EXCLUDED.condicion_liquidacion,
                            precio = EXCLUDED.precio,
                            fecha_sincronizacion = CURRENT_TIMESTAMP
                        """)
                        .setParameter("eventoId", eventoId)
                        .setParameter("ticketId", ticket.getTicketId())
                        .setParameter("condicion", condicionNormalizada)
                        .setParameter("precio", ticket.getPrecio() != null ? ticket.getPrecio() : BigDecimal.ZERO)
                        .executeUpdate();
            }
        }
    }

    private Optional<ResumenVentasEvento> findCachedSnapshot(Long eventoId, EventoMetadata metadata) {
        ensureSnapshotCacheTable();
        String cacheSql = """
                SELECT condicion_liquidacion, cantidad, valor_total
                FROM resumen_ventas_cache
                WHERE evento_id = :eventoId
                """;
        var rows = entityManager.createNativeQuery(cacheSql)
                .setParameter("eventoId", eventoId)
                .getResultList();

        if (rows.isEmpty()) {
            return Optional.empty();
        }

        Map<CondicionLiquidacion, Integer> tickets = new EnumMap<>(CondicionLiquidacion.class);
        Map<CondicionLiquidacion, BigDecimal> recaudo = new EnumMap<>(CondicionLiquidacion.class);
        for (Object rowObj : rows) {
            Object[] row = (Object[]) rowObj;
            CondicionLiquidacion condicion = CondicionLiquidacion.valueOf(String.valueOf(row[0]));
            tickets.put(condicion, ((Number) row[1]).intValue());
            recaudo.put(condicion, (BigDecimal) row[2]);
        }

        for (CondicionLiquidacion c : CondicionLiquidacion.values()) {
            tickets.putIfAbsent(c, 0);
            recaudo.putIfAbsent(c, BigDecimal.ZERO);
        }

        BigDecimal total = recaudo.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        ResumenVentasEvento out = new ResumenVentasEvento();
        out.setIdEvento(eventoId);
        out.setNombreEvento(metadata.nombre());
        out.setEstadoEvento(metadata.estado());
        out.setTicketsPorCondicion(tickets);
        out.setRecaudoPorCondicion(recaudo);
        out.setTotalRecaudoBruto(total);
        return Optional.of(out);
    }

    private void ensureSnapshotCacheTable() {
        entityManager.createNativeQuery("""
                CREATE TABLE IF NOT EXISTS resumen_ventas_cache (
                    evento_id BIGINT NOT NULL,
                    condicion_liquidacion VARCHAR(32) NOT NULL,
                    cantidad INTEGER NOT NULL DEFAULT 0,
                    valor_total NUMERIC(14,2) NOT NULL DEFAULT 0,
                    fecha_sincronizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (evento_id, condicion_liquidacion)
                )
                """).executeUpdate();
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

    private void ensureEventosExternosTipoRecintoColumn() {
        entityManager.createNativeQuery("""
                ALTER TABLE eventos_externos
                ADD COLUMN IF NOT EXISTS tipo_recinto VARCHAR(64)
                """).executeUpdate();
        entityManager.createNativeQuery("""
                ALTER TABLE eventos_externos
                ADD COLUMN IF NOT EXISTS nombre_recinto VARCHAR(255)
                """).executeUpdate();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}

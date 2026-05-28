package com.ticketevents.liquidation.infrastructure.adapter.output.external;

import com.ticketevents.liquidation.domain.entities.EventoFinalizado;
import com.ticketevents.liquidation.domain.repositories.EventCatalogRepository;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.Module1EventSummaryDto;
import com.ticketevents.liquidation.infrastructure.mappers.EventoFinalizadoMapper;
import jakarta.persistence.EntityManager;
import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@ConditionalOnProperty(name = "external.module1.enabled", havingValue = "true")
public class RemoteEventCatalogRepositoryAdapter implements EventCatalogRepository {
    private static final String ESTADO_FINALIZADO = "FINALIZADO";
    private static final String ESTADO_LOCAL_CERRADO = "CERRADO";

    private final Module1HttpClient client;
    private final Module1MappingProperties properties;
    private final EventoFinalizadoMapper mapper;
    private final EntityManager entityManager;

    public RemoteEventCatalogRepositoryAdapter(Module1HttpClient client,
                                               Module1MappingProperties properties,
                                               EventoFinalizadoMapper mapper,
                                               EntityManager entityManager) {
        this.client = client;
        this.properties = properties;
        this.mapper = mapper;
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public List<EventoFinalizado> findEventosFinalizados() {
        ensureIntegrationTable();
        try {
            return client.getEventosPorEstado(ESTADO_FINALIZADO).stream()
                    .map(evento -> mapper.fromModule1(evento, synchronizeEvent(evento)))
                    .toList();
        } catch (RuntimeException ex) {
            return findEventosFinalizadosFromLocalCache(ex);
        }
    }

    private List<EventoFinalizado> findEventosFinalizadosFromLocalCache(RuntimeException cause) {
        List<EventoFinalizado> eventos = findLocalFinalizados();
        if (eventos.isEmpty()) {
            throw cause;
        }
        return eventos;
    }

    private List<EventoFinalizado> findLocalFinalizados() {
        return entityManager.createNativeQuery("""
                SELECT e.id,
                       ee.evento_externo_id,
                       e.nombre,
                       ee.fecha_inicio,
                       ee.fecha_fin,
                       ee.tipo,
                       ee.recinto_externo_id,
                       COALESCE(ee.estado_externo, :estadoFinalizado) AS estado
                FROM eventos e
                LEFT JOIN eventos_externos ee ON ee.evento_local_id = e.id
                WHERE e.estado = :estadoLocal
                ORDER BY e.id
                """)
                .setParameter("estadoFinalizado", ESTADO_FINALIZADO)
                .setParameter("estadoLocal", ESTADO_LOCAL_CERRADO)
                .getResultList()
                .stream()
                .map(this::toEventoFinalizado)
                .toList();
    }

    private EventoFinalizado toEventoFinalizado(Object rowObj) {
        Object[] row = (Object[]) rowObj;
        EventoFinalizado evento = new EventoFinalizado();
        evento.setEventoIdLocal(((Number) row[0]).longValue());
        evento.setEventoIdExterno(toStringOrNull(row[1]));
        evento.setNombre(toStringOrNull(row[2]));
        evento.setFechaInicio(toStringOrNull(row[3]));
        evento.setFechaFin(toStringOrNull(row[4]));
        evento.setTipo(toStringOrNull(row[5]));
        evento.setRecintoIdExterno(toStringOrNull(row[6]));
        evento.setEstado(toStringOrNull(row[7]));
        return evento;
    }

    private Long synchronizeEvent(Module1EventSummaryDto evento) {
        if (evento == null || evento.getId() == null) {
            return null;
        }

        Long localId = findLocalIdByExternalId(evento.getId());
        if (localId == null) {
            localId = findLocalIdFromProperties(evento);
        }
        if (localId == null) {
            localId = nextLocalEventoId();
        }

        upsertLocalEvento(localId, evento);
        upsertExternalMapping(localId, evento);
        return localId;
    }

    private Long findLocalIdByExternalId(String externalId) {
        Object localId = entityManager.createNativeQuery("""
                SELECT evento_local_id
                FROM eventos_externos
                WHERE evento_externo_id = :externalId
                """)
                .setParameter("externalId", externalId)
                .getResultStream()
                .findFirst()
                .orElse(null);
        return localId == null ? null : ((Number) localId).longValue();
    }

    private Long findLocalIdFromProperties(Module1EventSummaryDto evento) {
        return properties.getMapping().entrySet().stream()
                .filter(entry -> evento.getId().equals(entry.getValue()))
                .map(entry -> parseLong(entry.getKey()))
                .filter(id -> id != null)
                .findFirst()
                .orElse(null);
    }

    private Long nextLocalEventoId() {
        Number nextId = (Number) entityManager.createNativeQuery("""
                SELECT COALESCE(MAX(id), 0) + 1
                FROM eventos
                """).getSingleResult();
        return nextId.longValue();
    }

    private void upsertLocalEvento(Long localId, Module1EventSummaryDto evento) {
        entityManager.createNativeQuery("""
                INSERT INTO eventos (id, nombre, estado)
                VALUES (:id, :nombre, :estado)
                ON CONFLICT (id) DO UPDATE
                SET nombre = EXCLUDED.nombre,
                    estado = EXCLUDED.estado
                """)
                .setParameter("id", localId)
                .setParameter("nombre", evento.getNombre())
                .setParameter("estado", ESTADO_LOCAL_CERRADO)
                .executeUpdate();
    }

    private void upsertExternalMapping(Long localId, Module1EventSummaryDto evento) {
        entityManager.createNativeQuery("""
                INSERT INTO eventos_externos (
                    evento_local_id, evento_externo_id, recinto_externo_id, estado_externo,
                    tipo, tipo_recinto, fecha_inicio, fecha_fin, fecha_sincronizacion
                )
                VALUES (
                    :localId, :externalId, :recintoId, :estado, :tipo, NULL, :fechaInicio, :fechaFin,
                    CURRENT_TIMESTAMP
                )
                ON CONFLICT (evento_externo_id) DO UPDATE
                SET evento_local_id = EXCLUDED.evento_local_id,
                    recinto_externo_id = EXCLUDED.recinto_externo_id,
                    estado_externo = EXCLUDED.estado_externo,
                    tipo = EXCLUDED.tipo,
                    tipo_recinto = COALESCE(eventos_externos.tipo_recinto, EXCLUDED.tipo_recinto),
                    fecha_inicio = EXCLUDED.fecha_inicio,
                    fecha_fin = EXCLUDED.fecha_fin,
                    fecha_sincronizacion = CURRENT_TIMESTAMP
                """)
                .setParameter("localId", localId)
                .setParameter("externalId", evento.getId())
                .setParameter("recintoId", evento.getRecintoId())
                .setParameter("estado", evento.getEstado())
                .setParameter("tipo", evento.getTipo())
                .setParameter("fechaInicio", evento.getFechaInicio())
                .setParameter("fechaFin", evento.getFechaFin())
                .executeUpdate();
    }

    private void ensureIntegrationTable() {
        entityManager.createNativeQuery("""
                CREATE TABLE IF NOT EXISTS eventos_externos (
                    evento_local_id BIGINT PRIMARY KEY,
                    evento_externo_id VARCHAR(64) NOT NULL UNIQUE,
                    recinto_externo_id VARCHAR(64),
                    estado_externo VARCHAR(32),
                    tipo VARCHAR(64),
                    tipo_recinto VARCHAR(64),
                    fecha_inicio VARCHAR(64),
                    fecha_fin VARCHAR(64),
                    fecha_sincronizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """).executeUpdate();
        entityManager.createNativeQuery("""
                ALTER TABLE eventos_externos
                ADD COLUMN IF NOT EXISTS tipo_recinto VARCHAR(64)
                """).executeUpdate();
    }

    private Long parseLong(String raw) {
        try {
            return Long.valueOf(raw);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String toStringOrNull(Object value) {
        return value == null ? null : String.valueOf(value);
    }
}

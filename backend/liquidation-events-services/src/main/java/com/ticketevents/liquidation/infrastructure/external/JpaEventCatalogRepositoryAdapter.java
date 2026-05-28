package com.ticketevents.liquidation.infrastructure.external;

import com.ticketevents.liquidation.domain.entities.EventoFinalizado;
import com.ticketevents.liquidation.domain.repositories.EventCatalogRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

@Repository
@ConditionalOnProperty(name = "external.module1.enabled", havingValue = "false", matchIfMissing = true)
public class JpaEventCatalogRepositoryAdapter implements EventCatalogRepository {
    private static final String ESTADO_FINALIZADO = "FINALIZADO";
    private static final String ESTADO_LOCAL_CERRADO = "CERRADO";

    private final EntityManager entityManager;

    public JpaEventCatalogRepositoryAdapter(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<EventoFinalizado> findEventosFinalizados() {
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

    private String toStringOrNull(Object value) {
        return value == null ? null : String.valueOf(value);
    }
}

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
    private final EntityManager entityManager;

    public JpaEventCatalogRepositoryAdapter(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<EventoFinalizado> findEventosFinalizados() {
        String sql = "SELECT e.id, e.nombre, e.estado FROM eventos e WHERE e.estado = 'CERRADO'";
        return entityManager.createNativeQuery(sql)
                .getResultList()
                .stream()
                .map(this::toEventoFinalizado)
                .toList();
    }

    private EventoFinalizado toEventoFinalizado(Object rowObj) {
        Object[] row = (Object[]) rowObj;
        EventoFinalizado evento = new EventoFinalizado();
        evento.setEventoIdLocal(((Number) row[0]).longValue());
        evento.setNombre(String.valueOf(row[1]));
        evento.setEstado(String.valueOf(row[2]));
        return evento;
    }
}

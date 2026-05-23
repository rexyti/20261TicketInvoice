package com.ticketevents.liquidation.infrastructure.external;

import com.ticketevents.liquidation.domain.entities.CondicionLiquidacion;
import com.ticketevents.liquidation.domain.entities.ResumenVentasEvento;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Component;

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

        String resumenSql = """
                SELECT t.condicion_liquidacion, COUNT(*), COALESCE(SUM(t.valor_liquidacion),0)
                FROM tickets t
                WHERE t.evento_id = :eventoId
                GROUP BY t.condicion_liquidacion
                """;
        var rows = entityManager.createNativeQuery(resumenSql)
                .setParameter("eventoId", eventoId)
                .getResultList();

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
}

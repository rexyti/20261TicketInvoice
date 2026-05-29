package com.ticketevents.liquidation.infrastructure.external;

import com.ticketevents.liquidation.domain.entities.EstadoFinanciero;
import com.ticketevents.liquidation.domain.repositories.IngresosConsultaRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class JpaIngresosRepositoryAdapter implements IngresosConsultaRepository {

    private final EntityManager entityManager;

    public JpaIngresosRepositoryAdapter(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<Object[]> obtenerTicketsAgrupados(Long eventoId) {
        String sql = """
                SELECT t.estado_financiero, t.valor_ticket
                FROM tickets t
                WHERE t.evento_id = :eventoId
                """;
        List<Object[]> tickets = entityManager.createNativeQuery(sql)
                .setParameter("eventoId", eventoId)
                .getResultList()
                .stream()
                .map(row -> {
                    Object[] r = (Object[]) row;
                    return new Object[]{
                            EstadoFinanciero.valueOf(String.valueOf(r[0])),
                            (BigDecimal) r[1]
                    };
                })
                .toList();
        if (!tickets.isEmpty()) {
            return tickets;
        }

        String cacheSql = """
                SELECT condicion_liquidacion, valor_total, cantidad
                FROM resumen_ventas_cache
                WHERE evento_id = :eventoId
                """;
        List<?> cachedRows = entityManager.createNativeQuery(cacheSql)
                .setParameter("eventoId", eventoId)
                .getResultList();
        List<Object[]> cachedTickets = new ArrayList<>();
        for (Object row : cachedRows) {
            Object[] r = (Object[]) row;
            EstadoFinanciero estado = mapCondicionToEstadoFinanciero(String.valueOf(r[0]));
            BigDecimal valorTotal = (BigDecimal) r[1];
            int cantidad = ((Number) r[2]).intValue();
            cachedTickets.add(new Object[]{estado, valorTotal, cantidad});
        }
        return cachedTickets;
    }

    @Override
    public boolean existeEvento(Long eventoId) {
        String sql = "SELECT EXISTS (SELECT 1 FROM eventos e WHERE e.id = :eventoId)";
        Boolean exists = (Boolean) entityManager.createNativeQuery(sql)
                .setParameter("eventoId", eventoId)
                .getSingleResult();
        return Boolean.TRUE.equals(exists);
    }

    private EstadoFinanciero mapCondicionToEstadoFinanciero(String condicion) {
        return switch (condicion) {
            case "VALIDADO" -> EstadoFinanciero.VALIDADO;
            case "VENDIDO" -> EstadoFinanciero.VENDIDO;
            case "CORTESIA" -> EstadoFinanciero.CORTESIA;
            case "CANCELADO" -> EstadoFinanciero.CANCELADO;
            default -> null;
        };
    }
}

package com.ticketevents.liquidation.infrastructure.mappers;

import com.ticketevents.liquidation.domain.entities.CondicionLiquidacion;
import com.ticketevents.liquidation.domain.entities.ResumenVentasEvento;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.CondicionDto;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.Module1EventSnapshotDto;
import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Maps Module1 external snapshot DTO into domain ResumenVentasEvento.
 * Tolerant mapping: normalizes condition strings and maps known variants.
 */
@Component
public class Module1EventSnapshotMapper {
    private static final Logger log = LoggerFactory.getLogger(Module1EventSnapshotMapper.class);

    public ResumenVentasEvento map(Module1EventSnapshotDto src, Long localEventoId) {
        Map<CondicionLiquidacion, Integer> tickets = new EnumMap<>(CondicionLiquidacion.class);
        Map<CondicionLiquidacion, BigDecimal> recaudo = new EnumMap<>(CondicionLiquidacion.class);

        List<CondicionDto> condiciones = src.getCondiciones();
        if (condiciones != null) {
            for (CondicionDto c : condiciones) {
                CondicionLiquidacion key = mapCondicion(c.getCondicion());
                tickets.put(key, c.getCantidad());
                recaudo.put(key, c.getValorTotal() == null ? BigDecimal.ZERO : c.getValorTotal());
            }
        }

        for (CondicionLiquidacion c : CondicionLiquidacion.values()) {
            tickets.putIfAbsent(c, 0);
            recaudo.putIfAbsent(c, BigDecimal.ZERO);
        }

        BigDecimal total = recaudo.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        ResumenVentasEvento out = new ResumenVentasEvento();
        // preserve local numeric id for domain consistency
        out.setIdEvento(localEventoId);
        String nombre = src.getNombreEvento();
        if (nombre != null && !nombre.isBlank()) {
            out.setNombreEvento(nombre.trim());
        }
        out.setEstadoEvento(null);
        out.setTicketsPorCondicion(tickets);
        out.setRecaudoPorCondicion(recaudo);
        out.setTotalRecaudoBruto(total);
        return out;
    }

    private CondicionLiquidacion mapCondicion(String raw) {
        if (raw == null) return CondicionLiquidacion.VENDIDO;
        String s = raw.trim().toUpperCase();
        // tolerant mapping of known variants
        switch (s) {
            case "VALIDADO":
            case "VALIDADO_CHECKIN":
                return CondicionLiquidacion.VALIDADO;
            case "VENDIDO":
            case "VENDIDO_SIN_ASISTENCIA":
            case "VENDIDO_SINASISTENCIA":
                return CondicionLiquidacion.VENDIDO;
            case "CORTESIA":
            case "CORTESIAS":
                return CondicionLiquidacion.CORTESIA;
            case "CANCELADO":
            case "ANULADO":
                return CondicionLiquidacion.CANCELADO;
            default:
                log.warn("Unknown condicion received from Module1: '{}', defaulting to VENDIDO", raw);
                return CondicionLiquidacion.VENDIDO;
        }
    }
}

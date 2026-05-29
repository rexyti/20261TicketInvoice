package com.ticketevents.liquidation.application.usecase;

import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.IngresosTicketsDto;
import com.ticketevents.liquidation.domain.entities.EstadoFinanciero;
import com.ticketevents.liquidation.domain.entities.IngresosEvento;
import com.ticketevents.liquidation.domain.repositories.IngresosConsultaRepository;
import com.ticketevents.liquidation.infrastructure.mappers.IngresosMapper;
import com.ticketevents.liquidation.shared.errors.BusinessException;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultarIngresosTicketsUseCase {

    private static final Logger log = LoggerFactory.getLogger(ConsultarIngresosTicketsUseCase.class);

    private final IngresosConsultaRepository ingresosRepository;
    private final IngresosMapper mapper;

    public ConsultarIngresosTicketsUseCase(IngresosConsultaRepository ingresosRepository, IngresosMapper mapper) {
        this.ingresosRepository = ingresosRepository;
        this.mapper = mapper;
    }

    public IngresosTicketsDto execute(Long eventoId) {
        log.info("Iniciando consulta de ingresos de tickets para evento: {}", eventoId);

        if (eventoId == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "El ID del evento es requerido");
        }

        boolean existe = false;
        try {
            existe = ingresosRepository.existeEvento(eventoId);
        } catch (Exception e) {
            log.error("Error al verificar existencia del evento {}: {}", eventoId, e.getMessage());
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, e);
        }

        if (!existe) {
            log.warn("Evento {} no encontrado", eventoId);
            throw new BusinessException(ErrorCode.EVENT_NOT_FOUND);
        }

        IngresosEvento ingresos = new IngresosEvento(eventoId);

        try {
            List<Object[]> tickets = ingresosRepository.obtenerTicketsAgrupados(eventoId);
            for (Object[] row : tickets) {
                EstadoFinanciero estado = (EstadoFinanciero) row[0];
                java.math.BigDecimal valor = (java.math.BigDecimal) row[1];
                int cantidad = row.length > 2 && row[2] != null
                        ? ((Number) row[2]).intValue()
                        : 1;
                ingresos.agregarTickets(estado, cantidad, valor);
            }
        } catch (Exception e) {
            log.error("Error al consultar tickets para evento {}: {}", eventoId, e.getMessage());
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, e);
        }

        try {
            ingresos.validar();
        } catch (IllegalArgumentException e) {
            log.error("Validación de ingresos fallida para evento {}: {}", eventoId, e.getMessage());
            throw new BusinessException(ErrorCode.INVALID_REQUEST, e.getMessage());
        }

        IngresosTicketsDto dto = mapper.toDto(ingresos);

        log.info("Ingresos de tickets obtenidos exitosamente para evento: {}", eventoId);
        return dto;
    }
}

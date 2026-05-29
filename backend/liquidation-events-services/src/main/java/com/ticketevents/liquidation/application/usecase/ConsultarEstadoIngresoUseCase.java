package com.ticketevents.liquidation.application.usecase;

import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EstadoIngresoDto;
import com.ticketevents.liquidation.domain.entities.RegistroIngreso;
import com.ticketevents.liquidation.domain.repositories.AccessControlRepository;
import com.ticketevents.liquidation.infrastructure.mappers.EstadoIngresoMapper;
import com.ticketevents.liquidation.shared.errors.BusinessException;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultarEstadoIngresoUseCase {

    private static final Logger log = LoggerFactory.getLogger(ConsultarEstadoIngresoUseCase.class);

    private final AccessControlRepository accessControlRepository;
    private final EstadoIngresoMapper mapper;

    public ConsultarEstadoIngresoUseCase(AccessControlRepository accessControlRepository, EstadoIngresoMapper mapper) {
        this.accessControlRepository = accessControlRepository;
        this.mapper = mapper;
    }

    public EstadoIngresoDto execute(Long eventoId) {
        log.info("Iniciando consulta de estado de ingreso para evento: {}", eventoId);

        if (eventoId == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "El ID del evento es requerido");
        }

        List<RegistroIngreso> registros;
        try {
            registros = accessControlRepository.getIngresosByEvento(eventoId);
        } catch (Exception e) {
            log.error("Error al consultar servicio externo para evento {}: {}", eventoId, e.getMessage());
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, e);
        }

        if (registros == null) {
            registros = List.of();
        }

        for (RegistroIngreso reg : registros) {
            if (reg == null) {
                throw new TechnicalException(ErrorCode.INVALID_REQUEST,
                        "Registro nulo encontrado en la lista de ingresos");
            }
            if (reg.getIdTicket() == null || reg.getIdTicket().isBlank()) {
                throw new TechnicalException(ErrorCode.INVALID_REQUEST,
                        "Registro con ID de ticket invalido");
            }
            if (reg.getIdEvento() == null || reg.getIdEvento() <= 0) {
                throw new TechnicalException(ErrorCode.INVALID_REQUEST,
                        "Registro con ID de evento invalido");
            }
            if (reg.getEstadoIngreso() == null) {
                throw new TechnicalException(ErrorCode.INVALID_REQUEST,
                        "Registro sin estado de ingreso");
            }
        }

        String nombreEvento = obtenerNombreEvento(eventoId);
        EstadoIngresoDto output = mapper.toOutput(eventoId, nombreEvento, registros);

        log.info("Estado de ingreso obtenido para evento: {}", eventoId);
        return output;
    }

    private String obtenerNombreEvento(Long eventoId) {
        return switch (eventoId.intValue()) {
            case 1 -> "Concierto Rock 2026";
            case 2 -> "Festival de Teatro Nacional";
            default -> "Evento #" + eventoId;
        };
    }
}

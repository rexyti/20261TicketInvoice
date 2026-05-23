package com.ticketevents.liquidation.application.usecase;

import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EventSnapshotDto;
import com.ticketevents.liquidation.domain.entities.ResumenVentasEvento;
import com.ticketevents.liquidation.domain.repositories.EventSnapshotRepository;
import com.ticketevents.liquidation.infrastructure.mappers.ResumenVentasMapper;
import com.ticketevents.liquidation.shared.errors.BusinessException;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ConsultarResumenVentasUseCase {

    private static final Logger log = LoggerFactory.getLogger(ConsultarResumenVentasUseCase.class);

    private final EventSnapshotRepository eventSnapshotRepository;
    private final ResumenVentasMapper mapper;

    public ConsultarResumenVentasUseCase(EventSnapshotRepository eventSnapshotRepository, ResumenVentasMapper mapper) {
        this.eventSnapshotRepository = eventSnapshotRepository;
        this.mapper = mapper;
    }

    public EventSnapshotDto execute(Long eventoId) {
        log.info("Iniciando consulta de resumen de ventas para evento: {}", eventoId);

        if (eventoId == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "El ID del evento es requerido");
        }

        ResumenVentasEvento snapshot;
        try {
            snapshot = eventSnapshotRepository.getSnapshot(eventoId);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error al consultar servicio externo para evento {}: {}", eventoId, e.getMessage());
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, e);
        }

        if (snapshot == null) {
            throw new BusinessException(ErrorCode.EVENT_NOT_FOUND);
        }

        try {
            snapshot.validar();
        } catch (IllegalArgumentException e) {
            log.error("Validacion de snapshot fallida para evento {}: {}", eventoId, e.getMessage());
            throw new TechnicalException(ErrorCode.INVALID_REQUEST, e.getMessage());
        }

        String estadoEvento = snapshot.getEstadoEvento();
        if (!esEstadoCerrado(estadoEvento)) {
            log.warn("Evento {} no está cerrado. Estado actual: {}", eventoId, estadoEvento);
            throw new BusinessException(ErrorCode.EVENT_NOT_CLOSED, 
                    "El evento aún no ha sido cerrado. Estado actual: " + estadoEvento);
        }

        log.info("Resumen de ventas obtenido exitosamente para evento: {}", eventoId);
        return mapper.toDto(snapshot);
    }

    private boolean esEstadoCerrado(String estado) {
        return estado != null && estado.equalsIgnoreCase("CERRADO");
    }
}
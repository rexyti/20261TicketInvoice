package com.ticketevents.liquidation.application.usecase;

import com.ticketevents.liquidation.domain.entities.RecintoEvento;
import com.ticketevents.liquidation.domain.repositories.EventoRecintoRepository;
import com.ticketevents.liquidation.shared.errors.BusinessException;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ConsultarRecintoEventoUseCase {
    private static final Logger log = LoggerFactory.getLogger(ConsultarRecintoEventoUseCase.class);

    private final EventoRecintoRepository repository;

    public ConsultarRecintoEventoUseCase(EventoRecintoRepository repository) {
        this.repository = repository;
    }

    public RecintoEvento execute(Long eventoId) {
        if (eventoId == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "El ID del evento es requerido");
        }

        try {
            RecintoEvento recinto = repository.findByEventoId(eventoId);
            if (recinto == null || recinto.getTipoRecinto() == null || recinto.getTipoRecinto().isBlank()) {
                throw new BusinessException(
                        ErrorCode.RECINTO_NOT_FOUND,
                        "No hay informacion de recinto sincronizada para el evento");
            }
            return recinto;
        } catch (BusinessException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Error consultando recinto del evento {}", eventoId, ex);
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE,
                    "No fue posible obtener la informacion del recinto", ex);
        }
    }
}

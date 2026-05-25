package com.ticketevents.liquidation.application.usecase;

import com.ticketevents.liquidation.domain.entities.EventoFinalizado;
import com.ticketevents.liquidation.domain.repositories.EventCatalogRepository;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EventoFinalizadoDto;
import com.ticketevents.liquidation.infrastructure.mappers.EventoFinalizadoMapper;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ConsultarEventosFinalizadosUseCase {
    private static final Logger log = LoggerFactory.getLogger(ConsultarEventosFinalizadosUseCase.class);

    private final EventCatalogRepository eventCatalogRepository;
    private final EventoFinalizadoMapper mapper;

    public ConsultarEventosFinalizadosUseCase(EventCatalogRepository eventCatalogRepository,
                                              EventoFinalizadoMapper mapper) {
        this.eventCatalogRepository = eventCatalogRepository;
        this.mapper = mapper;
    }

    public List<EventoFinalizadoDto> execute() {
        try {
            List<EventoFinalizado> eventos = eventCatalogRepository.findEventosFinalizados();
            return eventos.stream().map(mapper::toDto).toList();
        } catch (Exception ex) {
            log.error("Error consultando eventos finalizados", ex);
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE,
                    "No fue posible obtener los eventos finalizados", ex);
        }
    }
}

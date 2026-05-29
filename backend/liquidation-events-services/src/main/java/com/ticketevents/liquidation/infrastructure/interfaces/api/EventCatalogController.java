package com.ticketevents.liquidation.infrastructure.interfaces.api;

import com.ticketevents.liquidation.application.usecase.ConsultarEventosFinalizadosUseCase;
import com.ticketevents.liquidation.application.usecase.ConsultarRecintoEventoUseCase;
import com.ticketevents.liquidation.domain.entities.RecintoEvento;
import com.ticketevents.liquidation.infrastructure.adapter.input.rest.response.ConsultarRecintoEventoResponse;
import com.ticketevents.liquidation.infrastructure.adapter.input.rest.response.EventoFinalizadoResponse;
import com.ticketevents.liquidation.infrastructure.mappers.EventoFinalizadoMapper;
import com.ticketevents.liquidation.infrastructure.mappers.RecintoEventoMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/eventos")
@Tag(name = "00. Catálogo de Eventos", description = "Consulta eventos finalizados disponibles para liquidación")
public class EventCatalogController {
    private static final Logger log = LoggerFactory.getLogger(EventCatalogController.class);

    private final ConsultarEventosFinalizadosUseCase consultarEventosFinalizadosUseCase;
    private final ConsultarRecintoEventoUseCase consultarRecintoEventoUseCase;
    private final EventoFinalizadoMapper mapper;
    private final RecintoEventoMapper recintoEventoMapper;

    public EventCatalogController(ConsultarEventosFinalizadosUseCase consultarEventosFinalizadosUseCase,
                                  ConsultarRecintoEventoUseCase consultarRecintoEventoUseCase,
                                  EventoFinalizadoMapper mapper,
                                  RecintoEventoMapper recintoEventoMapper) {
        this.consultarEventosFinalizadosUseCase = consultarEventosFinalizadosUseCase;
        this.consultarRecintoEventoUseCase = consultarRecintoEventoUseCase;
        this.mapper = mapper;
        this.recintoEventoMapper = recintoEventoMapper;
    }

    @Operation(summary = "Consultar eventos finalizados", description = """
            Obtiene desde Módulo 1 los eventos en estado FINALIZADO.
            Si un evento externo ya está configurado en el mapping local, la respuesta incluye eventoIdLocal.
            """)
    @GetMapping("/finalizados")
    public ResponseEntity<List<EventoFinalizadoResponse>> consultarEventosFinalizados() {
        log.info("Solicitud de eventos finalizados");
        List<EventoFinalizadoResponse> response = consultarEventosFinalizadosUseCase.execute().stream()
                .map(mapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Consultar recinto asociado al evento", description = """
            Obtiene la informacion de recinto sincronizada desde el snapshot de Modulo 1.
            La metadata se actualiza cuando se consulta el resumen de ventas del evento.
            """)
    @GetMapping("/{id}/recinto")
    public ResponseEntity<ConsultarRecintoEventoResponse> consultarRecintoEvento(@PathVariable("id") Long id) {
        log.info("Solicitud de recinto para evento: {}", id);
        RecintoEvento recinto = consultarRecintoEventoUseCase.execute(id);
        return ResponseEntity.ok(recintoEventoMapper.toResponse(recinto));
    }
}

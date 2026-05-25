package com.ticketevents.liquidation.infrastructure.mappers;

import com.ticketevents.liquidation.domain.entities.EventoFinalizado;
import com.ticketevents.liquidation.infrastructure.adapter.input.rest.response.EventoFinalizadoResponse;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EventoFinalizadoDto;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.Module1EventSummaryDto;
import org.springframework.stereotype.Component;

@Component
public class EventoFinalizadoMapper {

    public EventoFinalizado fromModule1(Module1EventSummaryDto dto, Long eventoIdLocal) {
        EventoFinalizado evento = new EventoFinalizado();
        evento.setEventoIdLocal(eventoIdLocal);
        evento.setEventoIdExterno(dto.getId());
        evento.setNombre(dto.getNombre());
        evento.setFechaInicio(dto.getFechaInicio());
        evento.setFechaFin(dto.getFechaFin());
        evento.setTipo(dto.getTipo());
        evento.setRecintoIdExterno(dto.getRecintoId());
        evento.setEstado(dto.getEstado());
        evento.setReingresoHabilitado(dto.isReingresoHabilitado());
        return evento;
    }

    public EventoFinalizadoDto toDto(EventoFinalizado evento) {
        EventoFinalizadoDto dto = new EventoFinalizadoDto();
        dto.setEventoIdLocal(evento.getEventoIdLocal());
        dto.setEventoIdExterno(evento.getEventoIdExterno());
        dto.setNombre(evento.getNombre());
        dto.setFechaInicio(evento.getFechaInicio());
        dto.setFechaFin(evento.getFechaFin());
        dto.setTipo(evento.getTipo());
        dto.setRecintoIdExterno(evento.getRecintoIdExterno());
        dto.setEstado(evento.getEstado());
        dto.setReingresoHabilitado(evento.isReingresoHabilitado());
        return dto;
    }

    public EventoFinalizadoResponse toResponse(EventoFinalizadoDto dto) {
        EventoFinalizadoResponse response = new EventoFinalizadoResponse();
        response.setEventoIdLocal(dto.getEventoIdLocal());
        response.setEventoIdExterno(dto.getEventoIdExterno());
        response.setNombre(dto.getNombre());
        response.setFechaInicio(dto.getFechaInicio());
        response.setFechaFin(dto.getFechaFin());
        response.setTipo(dto.getTipo());
        response.setRecintoIdExterno(dto.getRecintoIdExterno());
        response.setEstado(dto.getEstado());
        response.setReingresoHabilitado(dto.isReingresoHabilitado());
        return response;
    }
}

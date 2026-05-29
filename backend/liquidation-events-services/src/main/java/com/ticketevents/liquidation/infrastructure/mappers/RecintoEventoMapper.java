package com.ticketevents.liquidation.infrastructure.mappers;

import com.ticketevents.liquidation.domain.entities.RecintoEvento;
import com.ticketevents.liquidation.infrastructure.adapter.input.rest.response.ConsultarRecintoEventoResponse;
import org.springframework.stereotype.Component;

@Component
public class RecintoEventoMapper {
    public ConsultarRecintoEventoResponse toResponse(RecintoEvento recinto) {
        ConsultarRecintoEventoResponse response = new ConsultarRecintoEventoResponse();
        response.setEventoIdLocal(recinto.getEventoIdLocal());
        response.setEventoIdExterno(recinto.getEventoIdExterno());
        response.setRecintoIdExterno(recinto.getRecintoIdExterno());
        response.setNombreRecinto(recinto.getNombreRecinto());
        response.setTipoRecinto(recinto.getTipoRecinto());
        response.setEstado(recinto.getEstado());
        return response;
    }
}

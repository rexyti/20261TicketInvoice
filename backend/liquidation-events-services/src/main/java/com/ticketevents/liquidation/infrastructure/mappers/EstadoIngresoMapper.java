package com.ticketevents.liquidation.infrastructure.mappers;

import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EstadoIngresoDto;
import com.ticketevents.liquidation.domain.entities.RegistroIngreso;
import com.ticketevents.liquidation.infrastructure.adapter.input.rest.response.ConsultarEstadoIngresoResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EstadoIngresoMapper {

    public EstadoIngresoDto toOutput(Long eventoId, String nombreEvento, List<RegistroIngreso> registros) {
        if (registros == null) {
            registros = List.of();
        }

        List<EstadoIngresoDto.RegistroIngresoDTO> registrosDTO = registros.stream()
                .map(reg -> new EstadoIngresoDto.RegistroIngresoDTO(
                    reg.getIdTicket(),
                    reg.getIdEvento(),
                    reg.getFechaHoraIngreso() != null ? reg.getFechaHoraIngreso().toString() : null,
                    reg.getEstadoIngreso() != null ? reg.getEstadoIngreso().name() : null,
                    reg.getTipoAcceso()
                ))
                .collect(Collectors.toList());

        return new EstadoIngresoDto(eventoId, nombreEvento, registrosDTO);
    }

    public ConsultarEstadoIngresoResponse toResponse(EstadoIngresoDto output) {
        if (output == null) return null;

        ConsultarEstadoIngresoResponse response = new ConsultarEstadoIngresoResponse();
        response.setEventoId(output.getEventoId());
        response.setNombreEvento(output.getNombreEvento());

        List<ConsultarEstadoIngresoResponse.TicketEstadoIngreso> tickets = new ArrayList<>();
        int checkeados = 0;
        int noAsistieron = 0;

        for (EstadoIngresoDto.RegistroIngresoDTO dto : output.getRegistros()) {
            ConsultarEstadoIngresoResponse.TicketEstadoIngreso ticket = new ConsultarEstadoIngresoResponse.TicketEstadoIngreso();
            ticket.setIdTicket(dto.getIdTicket());
            ticket.setCodigoTicket(dto.getIdTicket());
            ticket.setEstadoIngreso(dto.getEstadoIngreso());
            ticket.setTipoAcceso(dto.getTipoAcceso());
            tickets.add(ticket);

            if ("CHECKED_IN".equals(dto.getEstadoIngreso())) {
                checkeados++;
            } else {
                noAsistieron++;
            }
        }

        response.setTickets(tickets);
        response.setTotalTickets(tickets.size());
        response.setTotalCheckeados(checkeados);
        response.setTotalNoAsistieron(noAsistieron);

        return response;
    }
}

package com.ticketevents.liquidation.infrastructure.adapter.input.rest.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Estado de ingreso de tickets de un evento")
public class ConsultarEstadoIngresoResponse {

    @Schema(description = "ID del evento", example = "1")
    private Long eventoId;

    @Schema(description = "Nombre del evento", example = "Concierto Rock 2026")
    private String nombreEvento;

    @Schema(description = "Lista de tickets con su estado de ingreso")
    private List<TicketEstadoIngreso> tickets;

    @Schema(description = "Total de tickets", example = "130")
    private int totalTickets;

    @Schema(description = "Total de tickets con check-in realizado", example = "100")
    private int totalCheckeados;

    @Schema(description = "Total de tickets sin check-in", example = "30")
    private int totalNoAsistieron;

    public ConsultarEstadoIngresoResponse() {}

    public Long getEventoId() { return eventoId; }
    public void setEventoId(Long eventoId) { this.eventoId = eventoId; }
    public String getNombreEvento() { return nombreEvento; }
    public void setNombreEvento(String nombreEvento) { this.nombreEvento = nombreEvento; }
    public List<TicketEstadoIngreso> getTickets() { return tickets; }
    public void setTickets(List<TicketEstadoIngreso> tickets) { this.tickets = tickets; }
    public int getTotalTickets() { return totalTickets; }
    public void setTotalTickets(int totalTickets) { this.totalTickets = totalTickets; }
    public int getTotalCheckeados() { return totalCheckeados; }
    public void setTotalCheckeados(int totalCheckeados) { this.totalCheckeados = totalCheckeados; }
    public int getTotalNoAsistieron() { return totalNoAsistieron; }
    public void setTotalNoAsistieron(int totalNoAsistieron) { this.totalNoAsistieron = totalNoAsistieron; }

    @Schema(description = "Estado de ingreso de un ticket individual")
    public static class TicketEstadoIngreso {
        @Schema(description = "ID del ticket", example = "1")
        private String idTicket;

        @Schema(description = "Código del ticket", example = "TKT-1")
        private String codigoTicket;

        @Schema(description = "Estado de ingreso", example = "CHECKED_IN", allowableValues = {"CHECKED_IN", "NOT_ATTENDED"})
        private String estadoIngreso;

        @Schema(description = "Tipo de acceso", example = "INGRESO", allowableValues = {"INGRESO", "REINGRESO"})
        private String tipoAcceso;

        public TicketEstadoIngreso() {}

        public String getIdTicket() { return idTicket; }
        public void setIdTicket(String idTicket) { this.idTicket = idTicket; }
        public String getCodigoTicket() { return codigoTicket; }
        public void setCodigoTicket(String codigoTicket) { this.codigoTicket = codigoTicket; }
        public String getEstadoIngreso() { return estadoIngreso; }
        public void setEstadoIngreso(String estadoIngreso) { this.estadoIngreso = estadoIngreso; }
        public String getTipoAcceso() { return tipoAcceso; }
        public void setTipoAcceso(String tipoAcceso) { this.tipoAcceso = tipoAcceso; }
    }
}

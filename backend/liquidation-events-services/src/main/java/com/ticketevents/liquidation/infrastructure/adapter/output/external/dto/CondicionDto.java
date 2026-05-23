package com.ticketevents.liquidation.infrastructure.adapter.output.external.dto;

import java.math.BigDecimal;
import java.util.List;

public class CondicionDto {
    private String condicion;
    private int cantidad;
    private BigDecimal valorTotal;
    private List<TicketDto> tickets;

    public String getCondicion() { return condicion; }
    public void setCondicion(String condicion) { this.condicion = condicion; }
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    public List<TicketDto> getTickets() { return tickets; }
    public void setTickets(List<TicketDto> tickets) { this.tickets = tickets; }
}

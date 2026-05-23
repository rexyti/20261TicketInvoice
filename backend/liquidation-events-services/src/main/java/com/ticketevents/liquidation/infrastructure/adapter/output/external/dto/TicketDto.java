package com.ticketevents.liquidation.infrastructure.adapter.output.external.dto;

import java.math.BigDecimal;

public class TicketDto {
    private String ticketId;
    private BigDecimal precio;

    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
}

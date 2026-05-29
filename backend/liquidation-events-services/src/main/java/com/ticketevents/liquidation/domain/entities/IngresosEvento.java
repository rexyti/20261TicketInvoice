package com.ticketevents.liquidation.domain.entities;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class IngresosEvento {
    private Long eventoId;
    private int totalTicketsVendidos;
    private int totalTicketsValidados;
    private int totalTicketsCancelados;
    private int totalCortesias;
    private int totalNoAsistieron;
    private BigDecimal totalRecaudoBruto;
    private Map<EstadoFinanciero, Integer> ticketsPorEstado;
    private boolean hasInconsistencies;

    public IngresosEvento(Long eventoId) {
        this.eventoId = eventoId;
        this.totalTicketsVendidos = 0;
        this.totalTicketsValidados = 0;
        this.totalTicketsCancelados = 0;
        this.totalCortesias = 0;
        this.totalNoAsistieron = 0;
        this.totalRecaudoBruto = BigDecimal.ZERO;
        this.ticketsPorEstado = new HashMap<>();
        this.hasInconsistencies = false;
    }

    public void agregarTicket(EstadoFinanciero estado, BigDecimal valor) {
        agregarTickets(estado, 1, valor);
    }

    public void agregarTickets(EstadoFinanciero estado, int cantidad, BigDecimal valorTotal) {
        if (estado == null) {
            this.hasInconsistencies = true;
            return;
        }
        if (cantidad <= 0) {
            return;
        }
        BigDecimal valor = valorTotal == null ? BigDecimal.ZERO : valorTotal;

        ticketsPorEstado.put(estado, ticketsPorEstado.getOrDefault(estado, 0) + cantidad);

        switch (estado) {
            case VALIDADO -> {
                totalTicketsValidados += cantidad;
                totalRecaudoBruto = totalRecaudoBruto.add(valor);
            }
            case VENDIDO, NO_ASISTIO -> {
                totalNoAsistieron += cantidad;
                totalRecaudoBruto = totalRecaudoBruto.add(valor);
            }
            case CORTESIA -> {
                totalCortesias += cantidad;
                totalRecaudoBruto = totalRecaudoBruto.add(valor);
            }
            case CANCELADO -> totalTicketsCancelados += cantidad;
        }
        totalTicketsVendidos += cantidad;
    }

    public void validar() {
        if (eventoId == null) {
            throw new IllegalArgumentException("El ID del evento es requerido");
        }
    }

    public Long getEventoId() { return eventoId; }
    public int getTotalTicketsVendidos() { return totalTicketsVendidos; }
    public int getTotalTicketsValidados() { return totalTicketsValidados; }
    public int getTotalTicketsCancelados() { return totalTicketsCancelados; }
    public int getTotalCortesias() { return totalCortesias; }
    public int getTotalNoAsistieron() { return totalNoAsistieron; }
    public BigDecimal getTotalRecaudoBruto() { return totalRecaudoBruto; }
    public Map<EstadoFinanciero, Integer> getTicketsPorEstado() { return ticketsPorEstado; }
    public boolean isHasInconsistencies() { return hasInconsistencies; }
}

package com.ticketevents.liquidation.domain.entities;

import java.time.LocalDateTime;

public class RegistroIngreso {
    private String idTicket;
    private Long idEvento;
    private LocalDateTime fechaHoraIngreso;
    private EstadoIngreso estadoIngreso;
    private String tipoAcceso;

    public RegistroIngreso() {}

    public RegistroIngreso(String idTicket, Long idEvento, LocalDateTime fechaHoraIngreso,
                          EstadoIngreso estadoIngreso, String tipoAcceso) {
        if (idTicket == null || idTicket.isBlank()) {
            throw new IllegalArgumentException("El ID del ticket es requerido");
        }
        if (idEvento == null || idEvento <= 0) {
            throw new IllegalArgumentException("El ID del evento debe ser positivo");
        }
        if (estadoIngreso == null) {
            throw new IllegalArgumentException("El estado de ingreso es requerido");
        }
        
        if (estadoIngreso == EstadoIngreso.CHECKED_IN) {
            if (fechaHoraIngreso == null) {
                throw new IllegalArgumentException("La fecha de ingreso es requerida cuando el ticket fue checkeado");
            }
            if (tipoAcceso == null || tipoAcceso.isBlank()) {
                throw new IllegalArgumentException("El tipo de acceso es requerido cuando el ticket fue checkeado");
            }
        }
        
        this.idTicket = idTicket;
        this.idEvento = idEvento;
        this.fechaHoraIngreso = fechaHoraIngreso;
        this.estadoIngreso = estadoIngreso;
        this.tipoAcceso = tipoAcceso;
    }

    public String getIdTicket() { return idTicket; }
    public void setIdTicket(String idTicket) { this.idTicket = idTicket; }
    public Long getIdEvento() { return idEvento; }
    public void setIdEvento(Long idEvento) { this.idEvento = idEvento; }
    public LocalDateTime getFechaHoraIngreso() { return fechaHoraIngreso; }
    public void setFechaHoraIngreso(LocalDateTime fechaHoraIngreso) { this.fechaHoraIngreso = fechaHoraIngreso; }
    public EstadoIngreso getEstadoIngreso() { return estadoIngreso; }
    public void setEstadoIngreso(EstadoIngreso estadoIngreso) { this.estadoIngreso = estadoIngreso; }
    public String getTipoAcceso() { return tipoAcceso; }
    public void setTipoAcceso(String tipoAcceso) { this.tipoAcceso = tipoAcceso; }
}

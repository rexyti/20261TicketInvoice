package com.ticketevents.liquidation.infrastructure.adapter.output.external.dto;

public class EventoFinalizadoDto {
    private Long eventoIdLocal;
    private String eventoIdExterno;
    private String nombre;
    private String fechaInicio;
    private String fechaFin;
    private String tipo;
    private String recintoIdExterno;
    private String estado;
    private boolean reingresoHabilitado;

    public Long getEventoIdLocal() { return eventoIdLocal; }
    public void setEventoIdLocal(Long eventoIdLocal) { this.eventoIdLocal = eventoIdLocal; }
    public String getEventoIdExterno() { return eventoIdExterno; }
    public void setEventoIdExterno(String eventoIdExterno) { this.eventoIdExterno = eventoIdExterno; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(String fechaInicio) { this.fechaInicio = fechaInicio; }
    public String getFechaFin() { return fechaFin; }
    public void setFechaFin(String fechaFin) { this.fechaFin = fechaFin; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getRecintoIdExterno() { return recintoIdExterno; }
    public void setRecintoIdExterno(String recintoIdExterno) { this.recintoIdExterno = recintoIdExterno; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public boolean isReingresoHabilitado() { return reingresoHabilitado; }
    public void setReingresoHabilitado(boolean reingresoHabilitado) { this.reingresoHabilitado = reingresoHabilitado; }
}

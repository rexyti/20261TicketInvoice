package com.ticketevents.liquidation.infrastructure.adapter.output.external.dto;

public class Module1EventSummaryDto {
    private String id;
    private String nombre;
    private String fechaInicio;
    private String fechaFin;
    private String tipo;
    private String recintoId;
    private String nombreRecinto;
    private String estado;
    private boolean reingresoHabilitado;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(String fechaInicio) { this.fechaInicio = fechaInicio; }
    public String getFechaFin() { return fechaFin; }
    public void setFechaFin(String fechaFin) { this.fechaFin = fechaFin; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getRecintoId() { return recintoId; }
    public void setRecintoId(String recintoId) { this.recintoId = recintoId; }
    public String getNombreRecinto() { return nombreRecinto; }
    public void setNombreRecinto(String nombreRecinto) { this.nombreRecinto = nombreRecinto; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public boolean isReingresoHabilitado() { return reingresoHabilitado; }
    public void setReingresoHabilitado(boolean reingresoHabilitado) { this.reingresoHabilitado = reingresoHabilitado; }
}

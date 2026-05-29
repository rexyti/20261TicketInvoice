package com.ticketevents.liquidation.domain.entities;

public class RecintoEvento {
    private Long eventoIdLocal;
    private String eventoIdExterno;
    private String recintoIdExterno;
    private String nombreRecinto;
    private String tipoRecinto;
    private String estado;

    public Long getEventoIdLocal() { return eventoIdLocal; }
    public void setEventoIdLocal(Long eventoIdLocal) { this.eventoIdLocal = eventoIdLocal; }
    public String getEventoIdExterno() { return eventoIdExterno; }
    public void setEventoIdExterno(String eventoIdExterno) { this.eventoIdExterno = eventoIdExterno; }
    public String getRecintoIdExterno() { return recintoIdExterno; }
    public void setRecintoIdExterno(String recintoIdExterno) { this.recintoIdExterno = recintoIdExterno; }
    public String getNombreRecinto() { return nombreRecinto; }
    public void setNombreRecinto(String nombreRecinto) { this.nombreRecinto = nombreRecinto; }
    public String getTipoRecinto() { return tipoRecinto; }
    public void setTipoRecinto(String tipoRecinto) { this.tipoRecinto = tipoRecinto; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}

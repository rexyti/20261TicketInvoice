package com.ticketevents.liquidation.infrastructure.adapter.output.external.dto;

import java.util.List;

public class Module1EventSnapshotDto {

    private String eventoId;
    private String recintoId;
    private String tipoRecinto;
    private List<CondicionDto> condiciones;
    private String timestampGeneracion;

    public String getEventoId() { return eventoId; }
    public void setEventoId(String eventoId) { this.eventoId = eventoId; }
    public String getRecintoId() { return recintoId; }
    public void setRecintoId(String recintoId) { this.recintoId = recintoId; }
    public String getTipoRecinto() { return tipoRecinto; }
    public void setTipoRecinto(String tipoRecinto) { this.tipoRecinto = tipoRecinto; }
    public List<CondicionDto> getCondiciones() { return condiciones; }
    public void setCondiciones(List<CondicionDto> condiciones) { this.condiciones = condiciones; }
    public String getTimestampGeneracion() { return timestampGeneracion; }
    public void setTimestampGeneracion(String timestampGeneracion) { this.timestampGeneracion = timestampGeneracion; }
}

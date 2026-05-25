package com.ticketevents.liquidation.infrastructure.external;

/**
 * Event header fields from the local database (estado; nombre only if Module1 omits it).
 */
public record EventoMetadata(String nombre, String estado) {
}

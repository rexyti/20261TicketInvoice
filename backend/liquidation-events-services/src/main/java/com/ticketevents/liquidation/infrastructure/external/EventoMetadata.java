package com.ticketevents.liquidation.infrastructure.external;

/**
 * Event header fields owned by the local database (not provided by Module1 snapshot).
 */
public record EventoMetadata(String nombre, String estado) {
}

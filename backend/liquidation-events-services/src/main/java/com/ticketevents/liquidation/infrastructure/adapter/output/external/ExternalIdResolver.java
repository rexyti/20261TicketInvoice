package com.ticketevents.liquidation.infrastructure.adapter.output.external;

import java.util.Optional;

public interface ExternalIdResolver {
    /**
     * Resolve the external (module1) evento id (UUID string) from a local eventoId (Long).
     * If not present, return Optional.empty() to indicate no mapping is available.
     */
    Optional<String> resolveEventoExternalId(Long localEventoId);
}

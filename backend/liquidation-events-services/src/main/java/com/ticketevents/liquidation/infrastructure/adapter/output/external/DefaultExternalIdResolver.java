package com.ticketevents.liquidation.infrastructure.adapter.output.external;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * Resolver that never maps local IDs. Useful in unit tests when external integration is off.
 */
public class DefaultExternalIdResolver implements ExternalIdResolver {
    private static final Logger log = LoggerFactory.getLogger(DefaultExternalIdResolver.class);

    @Override
    public Optional<String> resolveEventoExternalId(Long localEventoId) {
        log.debug("No external id mapping available for eventoId={}", localEventoId);
        return Optional.empty();
    }
}

package com.ticketevents.liquidation.infrastructure.adapter.output.external;

import java.util.Optional;

import org.springframework.stereotype.Component;

/**
 * Resolver that reads mapping from Module1MappingProperties.
 */
@Component
public class PropertyExternalIdResolver implements ExternalIdResolver {

    private final Module1MappingProperties props;

    public PropertyExternalIdResolver(Module1MappingProperties props) {
        this.props = props;
    }

    @Override
    public Optional<String> resolveEventoExternalId(Long localEventoId) {
        if (localEventoId == null) return Optional.empty();
        String ext = props.getMapping().get(String.valueOf(localEventoId));
        return Optional.ofNullable(ext);
    }
}

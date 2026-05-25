package com.ticketevents.liquidation.infrastructure.adapter.output.external;

import jakarta.persistence.EntityManager;
import java.util.Optional;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Primary
@Component
@ConditionalOnProperty(name = "external.module1.enabled", havingValue = "true")
public class DatabaseExternalIdResolver implements ExternalIdResolver {
    private static final Logger log = LoggerFactory.getLogger(DatabaseExternalIdResolver.class);

    private final EntityManager entityManager;
    private final Module1MappingProperties properties;

    public DatabaseExternalIdResolver(EntityManager entityManager, Module1MappingProperties properties) {
        this.entityManager = entityManager;
        this.properties = properties;
    }

    @Override
    public Optional<String> resolveEventoExternalId(Long localEventoId) {
        if (localEventoId == null) {
            return Optional.empty();
        }

        String externalId = findExternalIdFromDatabase(localEventoId);

        if (externalId != null && !externalId.isBlank()) {
            return Optional.of(externalId);
        }

        return Optional.ofNullable(properties.getMapping().get(String.valueOf(localEventoId)));
    }

    private String findExternalIdFromDatabase(Long localEventoId) {
        try {
            return (String) entityManager.createNativeQuery("""
                    SELECT evento_externo_id
                    FROM eventos_externos
                    WHERE evento_local_id = :eventoId
                    """)
                    .setParameter("eventoId", localEventoId)
                    .getResultStream()
                    .findFirst()
                    .orElse(null);
        } catch (Exception ex) {
            log.debug("Could not resolve eventoId={} from eventos_externos; falling back to properties",
                    localEventoId);
            return null;
        }
    }
}

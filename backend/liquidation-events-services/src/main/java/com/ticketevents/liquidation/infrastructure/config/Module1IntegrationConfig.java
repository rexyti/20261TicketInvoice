package com.ticketevents.liquidation.infrastructure.config;

import com.ticketevents.liquidation.domain.repositories.EventSnapshotRepository;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.Module1MappingProperties;
import com.ticketevents.liquidation.infrastructure.external.JpaEventSnapshotRepositoryAdapter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(Module1MappingProperties.class)
public class Module1IntegrationConfig {

    @Bean
    @ConditionalOnProperty(name = "external.module1.enabled", havingValue = "false", matchIfMissing = true)
    EventSnapshotRepository eventSnapshotRepository(JpaEventSnapshotRepositoryAdapter adapter) {
        return adapter::getSnapshot;
    }
}

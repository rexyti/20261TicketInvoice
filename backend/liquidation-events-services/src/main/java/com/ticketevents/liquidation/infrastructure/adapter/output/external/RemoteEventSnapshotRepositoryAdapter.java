package com.ticketevents.liquidation.infrastructure.adapter.output.external;

import com.ticketevents.liquidation.domain.entities.ResumenVentasEvento;
import com.ticketevents.liquidation.domain.repositories.EventSnapshotRepository;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.Module1EventSnapshotDto;
import com.ticketevents.liquidation.infrastructure.external.EventoMetadata;
import com.ticketevents.liquidation.infrastructure.external.JpaEventSnapshotRepositoryAdapter;
import com.ticketevents.liquidation.infrastructure.mappers.Module1EventSnapshotMapper;
import com.ticketevents.liquidation.shared.errors.BusinessException;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Fetches ticket aggregates from Module1 and enriches estado (and nombre if missing) from the local database.
 */
@Repository
@ConditionalOnProperty(name = "external.module1.enabled", havingValue = "true")
public class RemoteEventSnapshotRepositoryAdapter implements EventSnapshotRepository {
    private static final Logger log = LoggerFactory.getLogger(RemoteEventSnapshotRepositoryAdapter.class);
    private static final String ESTADO_CERRADO = "CERRADO";

    private final Module1HttpClient client;
    private final ExternalIdResolver idResolver;
    private final JpaEventSnapshotRepositoryAdapter jpaAdapter;
    private final Module1EventSnapshotMapper mapper;
    private final boolean fallbackToJpa;

    public RemoteEventSnapshotRepositoryAdapter(Module1HttpClient client,
                                                ExternalIdResolver idResolver,
                                                JpaEventSnapshotRepositoryAdapter jpaAdapter,
                                                Module1EventSnapshotMapper mapper,
                                                Module1MappingProperties properties) {
        this.client = client;
        this.idResolver = idResolver;
        this.jpaAdapter = jpaAdapter;
        this.mapper = mapper;
        this.fallbackToJpa = properties.isFallbackToJpa();
    }

    @Override
    @Transactional
    public ResumenVentasEvento getSnapshot(Long eventoId) {
        Optional<String> externalId = idResolver.resolveEventoExternalId(eventoId);
        if (externalId.isEmpty()) {
            if (fallbackToJpa) {
                log.debug("No external mapping for eventoId={}, using local JPA snapshot", eventoId);
                return jpaAdapter.getSnapshot(eventoId);
            }
            throw new TechnicalException(
                    ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE,
                    "No Module1 mapping configured for eventoId=" + eventoId);
        }

        try {
            Module1EventSnapshotDto dto = client.getSnapshot(externalId.get());
            if (dto == null) {
                if (fallbackToJpa) {
                    log.warn("Module1 returned empty snapshot for externalId={}, falling back to JPA", externalId.get());
                    return jpaAdapter.getSnapshot(eventoId);
                }
                throw new TechnicalException(
                        ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE,
                        "Module1 returned no snapshot for eventoId=" + eventoId);
            }
            ResumenVentasEvento mapped = mapper.map(dto, eventoId);
            enrichEventMetadata(mapped, eventoId);
            jpaAdapter.updateExternalSnapshotMetadata(eventoId, dto);
            jpaAdapter.saveSnapshot(mapped);
            return mapped;
        } catch (BusinessException ex) {
            throw ex;
        } catch (TechnicalException ex) {
            if (fallbackToJpa) {
                log.error("Technical error while calling Module1, falling back to JPA", ex);
                return jpaAdapter.getSnapshot(eventoId);
            }
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error calling Module1", ex);
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, "Unexpected error calling Module1", ex);
        }
    }

    private void enrichEventMetadata(ResumenVentasEvento snapshot, Long eventoId) {
        Optional<EventoMetadata> local = jpaAdapter.findEventoMetadata(eventoId);
        if (nombreEventoAusente(snapshot) && local.isPresent()) {
            snapshot.setNombreEvento(local.get().nombre());
        }
        if (local.isPresent()) {
            snapshot.setEstadoEvento(local.get().estado());
            return;
        }
        snapshot.setEstadoEvento(ESTADO_CERRADO);
        log.debug(
                "No local metadata for eventoId={}; assuming {} because Module1 returned a snapshot",
                eventoId,
                ESTADO_CERRADO);
    }

    private static boolean nombreEventoAusente(ResumenVentasEvento snapshot) {
        String nombre = snapshot.getNombreEvento();
        return nombre == null || nombre.isBlank();
    }
}

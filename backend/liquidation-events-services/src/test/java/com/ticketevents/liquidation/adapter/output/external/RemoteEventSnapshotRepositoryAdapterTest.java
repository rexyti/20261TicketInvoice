package com.ticketevents.liquidation.adapter.output.external;

import com.ticketevents.liquidation.domain.entities.ResumenVentasEvento;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.DefaultExternalIdResolver;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.ExternalIdResolver;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.Module1HttpClient;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.Module1MappingProperties;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.RemoteEventSnapshotRepositoryAdapter;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.Module1EventSnapshotDto;
import com.ticketevents.liquidation.infrastructure.external.EventoMetadata;
import com.ticketevents.liquidation.infrastructure.external.JpaEventSnapshotRepositoryAdapter;
import com.ticketevents.liquidation.infrastructure.mappers.Module1EventSnapshotMapper;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

public class RemoteEventSnapshotRepositoryAdapterTest {

    @Test
    public void whenExternalIdMissing_withoutFallback_throws() {
        Module1HttpClient client = mock(Module1HttpClient.class);
        JpaEventSnapshotRepositoryAdapter jpa = mock(JpaEventSnapshotRepositoryAdapter.class);
        RemoteEventSnapshotRepositoryAdapter adapter = new RemoteEventSnapshotRepositoryAdapter(
                client,
                new DefaultExternalIdResolver(),
                jpa,
                mock(Module1EventSnapshotMapper.class),
                properties(false));

        TechnicalException ex = assertThrows(TechnicalException.class, () -> adapter.getSnapshot(999L));
        assertEquals(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, ex.getErrorCode());
        verifyNoInteractions(client);
        verify(jpa, never()).getSnapshot(anyLong());
    }

    @Test
    public void whenExternalIdMissing_withFallback_usesJpaAdapter() {
        Module1HttpClient client = mock(Module1HttpClient.class);
        ExternalIdResolver resolver = new DefaultExternalIdResolver();
        JpaEventSnapshotRepositoryAdapter jpa = mock(JpaEventSnapshotRepositoryAdapter.class);
        Module1EventSnapshotMapper mapper = mock(Module1EventSnapshotMapper.class);

        RemoteEventSnapshotRepositoryAdapter adapter = new RemoteEventSnapshotRepositoryAdapter(
                client, resolver, jpa, mapper, properties(true));

        adapter.getSnapshot(999L);

        verify(jpa, times(1)).getSnapshot(999L);
        verifyNoInteractions(client);
    }

    @Test
    public void whenClientReturns_enrichesMetadataFromLocalDb() {
        Module1HttpClient client = mock(Module1HttpClient.class);
        JpaEventSnapshotRepositoryAdapter jpa = mock(JpaEventSnapshotRepositoryAdapter.class);
        Module1EventSnapshotMapper mapper = mock(Module1EventSnapshotMapper.class);

        Module1EventSnapshotDto dto = new Module1EventSnapshotDto();
        ResumenVentasEvento mapped = new ResumenVentasEvento();
        when(client.getSnapshot(anyString())).thenReturn(dto);
        when(mapper.map(eq(dto), eq(1L))).thenReturn(mapped);
        when(jpa.findEventoMetadata(1L)).thenReturn(Optional.of(new EventoMetadata("Concierto", "CERRADO")));

        RemoteEventSnapshotRepositoryAdapter adapter = new RemoteEventSnapshotRepositoryAdapter(
                client, externalIdResolver(), jpa, mapper, properties(false));

        ResumenVentasEvento result = adapter.getSnapshot(1L);

        assertSame(mapped, result);
        assertEquals("Concierto", result.getNombreEvento());
        assertEquals("CERRADO", result.getEstadoEvento());
        verify(jpa, never()).getSnapshot(anyLong());
    }

    @Test
    public void whenClientReturns_withoutLocalMetadata_assumesCerrado() {
        Module1HttpClient client = mock(Module1HttpClient.class);
        JpaEventSnapshotRepositoryAdapter jpa = mock(JpaEventSnapshotRepositoryAdapter.class);
        Module1EventSnapshotMapper mapper = mock(Module1EventSnapshotMapper.class);

        Module1EventSnapshotDto dto = new Module1EventSnapshotDto();
        ResumenVentasEvento mapped = new ResumenVentasEvento();
        when(client.getSnapshot(anyString())).thenReturn(dto);
        when(mapper.map(eq(dto), eq(1L))).thenReturn(mapped);
        when(jpa.findEventoMetadata(1L)).thenReturn(Optional.empty());

        RemoteEventSnapshotRepositoryAdapter adapter = new RemoteEventSnapshotRepositoryAdapter(
                client, externalIdResolver(), jpa, mapper, properties(false));

        ResumenVentasEvento result = adapter.getSnapshot(1L);

        assertEquals("CERRADO", result.getEstadoEvento());
    }

    @Test
    public void whenClientFails_withoutFallback_propagatesError() {
        Module1HttpClient client = mock(Module1HttpClient.class);
        JpaEventSnapshotRepositoryAdapter jpa = mock(JpaEventSnapshotRepositoryAdapter.class);
        Module1EventSnapshotMapper mapper = mock(Module1EventSnapshotMapper.class);

        when(client.getSnapshot(anyString()))
                .thenThrow(new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE));

        RemoteEventSnapshotRepositoryAdapter adapter = new RemoteEventSnapshotRepositoryAdapter(
                client, externalIdResolver(), jpa, mapper, properties(false));

        assertThrows(TechnicalException.class, () -> adapter.getSnapshot(1L));
        verify(jpa, never()).getSnapshot(anyLong());
    }

    @Test
    public void whenClientFails_withFallback_usesJpa() {
        Module1HttpClient client = mock(Module1HttpClient.class);
        JpaEventSnapshotRepositoryAdapter jpa = mock(JpaEventSnapshotRepositoryAdapter.class);
        Module1EventSnapshotMapper mapper = mock(Module1EventSnapshotMapper.class);

        when(client.getSnapshot(anyString()))
                .thenThrow(new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE));
        ResumenVentasEvento fallback = new ResumenVentasEvento();
        when(jpa.getSnapshot(1L)).thenReturn(fallback);

        RemoteEventSnapshotRepositoryAdapter adapter = new RemoteEventSnapshotRepositoryAdapter(
                client, externalIdResolver(), jpa, mapper, properties(true));

        ResumenVentasEvento result = adapter.getSnapshot(1L);
        assertSame(fallback, result);
    }

    private static Module1MappingProperties properties(boolean fallbackToJpa) {
        Module1MappingProperties props = new Module1MappingProperties();
        props.setFallbackToJpa(fallbackToJpa);
        return props;
    }

    private static ExternalIdResolver externalIdResolver() {
        return localEventoId -> Optional.of("03c22676-5ea5-43e5-9c8d-1ccc59211e3c");
    }
}

package com.ticketevents.liquidation.integration;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.Module1MappingProperties;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.PropertyExternalIdResolver;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.Module1HttpClient;
import com.ticketevents.liquidation.infrastructure.mappers.Module1EventSnapshotMapper;
import com.ticketevents.liquidation.infrastructure.external.JpaEventSnapshotRepositoryAdapter;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.RemoteEventSnapshotRepositoryAdapter;
import com.ticketevents.liquidation.domain.entities.ResumenVentasEvento;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

public class RemoteEventSnapshotIntegrationTest {

    private WireMockServer wire;

    @BeforeEach
    public void startWireMock() {
        wire = new WireMockServer(WireMockConfiguration.options().dynamicPort());
        wire.start();
        WireMock.configureFor(wire.port());
    }

    @AfterEach
    public void stopWireMock() {
        if (wire != null) wire.stop();
    }

    @Test
    public void fetchesAndMapsSnapshotFromModule1() {
        String json = "{\n" +
                "    \"eventoId\": \"03c22676-5ea5-43e5-9c8d-1ccc59211e3c\",\n" +
                "    \"recintoId\": \"02c19c9e-f616-42a0-9271-6c3bca07a146\",\n" +
                "    \"tipoRecinto\": \"OTRO\",\n" +
                "    \"condiciones\": [\n" +
                "        {\n" +
                "            \"condicion\": \"VENDIDO_SIN_ASISTENCIA\",\n" +
                "            \"cantidad\": 3,\n" +
                "            \"valorTotal\": 60000.00,\n" +
                "            \"tickets\": [\n" +
                "                {\"ticketId\": \"f335e0a6-1f12-4ba2-89b1-45e1aad4beef\", \"precio\": 20000.00},\n" +
                "                {\"ticketId\": \"e45bc630-e01e-4a74-ba5d-92123bca7625\", \"precio\": 20000.00},\n" +
                "                {\"ticketId\": \"b483bdd8-8683-410e-8f82-1eafca99bea0\", \"precio\": 20000.00}\n" +
                "            ]\n" +
                "        },\n" +
                "        {\n" +
                "            \"condicion\": \"CORTESIA\",\n" +
                "            \"cantidad\": 1,\n" +
                "            \"valorTotal\": 0.00,\n" +
                "            \"tickets\": [ {\"ticketId\": \"e3b970da-2d8e-49af-9ee4-e660d92849d6\", \"precio\": 0.00} ]\n" +
                "        }\n" +
                "    ],\n" +
                "    \"timestampGeneracion\": \"2026-05-22T23:25:07.805964092\"\n" +
                "}";

        stubFor(get(urlEqualTo("/api/v1/eventos/03c22676-5ea5-43e5-9c8d-1ccc59211e3c/snapshot"))
                .willReturn(aResponse().withStatus(200).withHeader("Content-Type", "application/json")
                        .withBody(json.getBytes(StandardCharsets.UTF_8))));

        String base = String.format("http://localhost:%d", wire.port());
        Module1MappingProperties props = new Module1MappingProperties();
        props.getMapping().put("1", "03c22676-5ea5-43e5-9c8d-1ccc59211e3c");
        Module1HttpClient client = new Module1HttpClient(base, 2000, 5000, props);
        PropertyExternalIdResolver resolver = new PropertyExternalIdResolver(props);

        JpaEventSnapshotRepositoryAdapter jpa = mock(JpaEventSnapshotRepositoryAdapter.class);
        Module1EventSnapshotMapper mapper = new Module1EventSnapshotMapper();

        RemoteEventSnapshotRepositoryAdapter adapter = new RemoteEventSnapshotRepositoryAdapter(
                client, resolver, jpa, mapper, props);

        ResumenVentasEvento resumen = adapter.getSnapshot(1L);
        assertNotNull(resumen);
        assertEquals(3, resumen.getTicketsPorCondicion().get(com.ticketevents.liquidation.domain.entities.CondicionLiquidacion.VENDIDO).intValue());
        assertEquals(new java.math.BigDecimal("60000.00"), resumen.getRecaudoPorCondicion().get(com.ticketevents.liquidation.domain.entities.CondicionLiquidacion.VENDIDO));
    }
}

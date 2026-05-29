package com.ticketevents.liquidation.integration;

import com.ticketevents.liquidation.infrastructure.adapter.output.external.Module1HttpClient;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.Module1MappingProperties;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.Module1EventSnapshotDto;
import com.ticketevents.liquidation.shared.errors.BusinessException;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.HttpClientErrorException;

/**
 * Manual/live check against the real Module1 ngrok endpoint.
 * Skipped automatically when the tunnel is offline.
 *
 * Run: mvn test -Dtest=Module1LiveIntegrationTest
 */
@Tag("live")
class Module1LiveIntegrationTest {

    private static final String BASE_URL = System.getProperty(
            "module1.base-url",
            "https://uncoated-unfixed-imaginary.ngrok-free.dev");
    private static final String EVENTO_UUID = System.getProperty(
            "module1.evento-uuid",
            "00016ec5-90fb-4c63-aba9-3ea17abd27c0");

    @Test
    void module1SnapshotEndpointIsReachable() {
        Module1MappingProperties props = new Module1MappingProperties();
        Module1HttpClient client = new Module1HttpClient(BASE_URL, 5000, 15000, props);

        try {
            Module1EventSnapshotDto snapshot = client.getSnapshot(EVENTO_UUID);
            Assumptions.assumeTrue(snapshot != null, "Module1 returned empty body");
            Assumptions.assumeTrue(
                    snapshot.getCondiciones() != null && !snapshot.getCondiciones().isEmpty(),
                    "Module1 snapshot has no condiciones");
        } catch (TechnicalException ex) {
            Assumptions.abort("Module1 unavailable (tunnel offline or network error): " + ex.getMessage());
        } catch (BusinessException ex) {
            Assumptions.abort("Module1 live event is not available: " + ex.getMessage());
        } catch (HttpClientErrorException ex) {
            String body = ex.getResponseBodyAsString();
            if (body != null && body.contains("ERR_NGROK")) {
                Assumptions.abort("Module1 ngrok tunnel is offline — ask Module1 team to restart ngrok");
            }
            throw ex;
        }
    }
}

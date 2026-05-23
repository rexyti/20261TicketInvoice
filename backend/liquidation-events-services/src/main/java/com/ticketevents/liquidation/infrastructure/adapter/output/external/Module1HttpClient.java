package com.ticketevents.liquidation.infrastructure.adapter.output.external;

import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.Module1EventSnapshotDto;
import com.ticketevents.liquidation.shared.errors.BusinessException;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * HTTP client for Module1 snapshot API.
 */
@Component
@ConditionalOnProperty(name = "external.module1.enabled", havingValue = "true")
public class Module1HttpClient {
    private static final Logger log = LoggerFactory.getLogger(Module1HttpClient.class);
    private static final String NGROK_SKIP_HEADER = "Ngrok-Skip-Browser-Warning";

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final boolean ngrokSkipBrowserWarning;

    public Module1HttpClient(
            @Value("${external.module1.base-url:}") String baseUrl,
            @Value("${external.module1.connect-timeout-ms:2000}") int connectTimeoutMs,
            @Value("${external.module1.read-timeout-ms:5000}") int readTimeoutMs,
            Module1MappingProperties properties) {
        this.baseUrl = baseUrl != null ? baseUrl.replaceAll("/+$", "") : "";
        this.ngrokSkipBrowserWarning = properties.isNgrokSkipBrowserWarning();
        SimpleClientHttpRequestFactory rf = new SimpleClientHttpRequestFactory();
        rf.setConnectTimeout(connectTimeoutMs);
        rf.setReadTimeout(readTimeoutMs);
        this.restTemplate = new RestTemplate(rf);
    }

    public Module1EventSnapshotDto getSnapshot(String eventoUuid) {
        if (baseUrl.isBlank()) {
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, "Module1 base URL is not configured");
        }
        String url = String.format("%s/api/v1/eventos/%s/snapshot", baseUrl, eventoUuid);
        try {
            log.debug("Requesting Module1 snapshot from URL={}", url);
            HttpHeaders headers = new HttpHeaders();
            if (ngrokSkipBrowserWarning) {
                headers.set(NGROK_SKIP_HEADER, "true");
            }
            return restTemplate
                    .exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Module1EventSnapshotDto.class)
                    .getBody();
        } catch (HttpClientErrorException.NotFound ex) {
            if (isNgrokOrTunnelUnavailable(ex)) {
                log.error("Module1 tunnel appears offline for eventoUuid={}", eventoUuid);
                throw new TechnicalException(
                        ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, "Module1 tunnel unavailable", ex);
            }
            log.warn("Module1 snapshot not found for eventoUuid={}", eventoUuid);
            throw new BusinessException(ErrorCode.EVENT_NOT_FOUND);
        } catch (HttpClientErrorException ex) {
            log.error("Module1 returned HTTP {} for eventoUuid={}", ex.getStatusCode().value(), eventoUuid);
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, "Error calling Module1", ex);
        } catch (RestClientException ex) {
            log.error("Error calling Module1 snapshot endpoint", ex);
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, "Error calling Module1", ex);
        }
    }

    private static boolean isNgrokOrTunnelUnavailable(HttpClientErrorException ex) {
        String body = ex.getResponseBodyAsString();
        return body != null
                && (body.contains("ERR_NGROK") || body.contains("ngrok-free.dev is offline") || body.contains("<html"));
    }
}

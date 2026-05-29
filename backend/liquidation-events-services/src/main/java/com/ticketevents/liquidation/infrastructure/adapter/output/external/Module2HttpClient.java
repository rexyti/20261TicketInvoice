package com.ticketevents.liquidation.infrastructure.adapter.output.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class Module2HttpClient {
    private static final Logger log = LoggerFactory.getLogger(Module2HttpClient.class);
    private static final String NGROK_SKIP_HEADER = "Ngrok-Skip-Browser-Warning";

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final boolean enabled;
    private final boolean ngrokSkipBrowserWarning;

    public Module2HttpClient(
            @Value("${external.module2.base-url:}") String baseUrl,
            @Value("${external.module2.connect-timeout-ms:2000}") int connectTimeoutMs,
            @Value("${external.module2.read-timeout-ms:5000}") int readTimeoutMs,
            @Value("${external.module2.enabled:false}") boolean enabled,
            @Value("${external.module2.ngrok-skip-browser-warning:true}") boolean ngrokSkipBrowserWarning) {
        this.baseUrl = baseUrl != null ? baseUrl.replaceAll("/+$", "") : "";
        this.enabled = enabled;
        this.ngrokSkipBrowserWarning = ngrokSkipBrowserWarning;
        SimpleClientHttpRequestFactory rf = new SimpleClientHttpRequestFactory();
        rf.setConnectTimeout(connectTimeoutMs);
        rf.setReadTimeout(readTimeoutMs);
        this.restTemplate = new RestTemplate(rf);
    }

    public boolean isEnabled() {
        return enabled && !baseUrl.isBlank();
    }

    public List<AttendanceTicket> getAttendanceTickets(String eventId) {
        if (!isEnabled()) {
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, "Module2 is not configured");
        }

        String url = String.format("%s/api/v1/events/%s/attendance/tickets", baseUrl, eventId);
        try {
            HttpHeaders headers = new HttpHeaders();
            if (ngrokSkipBrowserWarning) {
                headers.set(NGROK_SKIP_HEADER, "true");
            }
            JsonNode body = restTemplate
                    .exchange(url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class)
                    .getBody();
            return extractTickets(body);
        } catch (RestClientException ex) {
            log.error("Error calling Module2 attendance tickets endpoint", ex);
            throw new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, "Error calling Module2", ex);
        }
    }

    private List<AttendanceTicket> extractTickets(JsonNode body) {
        if (body == null || body.isNull()) {
            return List.of();
        }

        JsonNode source = body;
        if (body.has("tickets")) {
            source = body.get("tickets");
        } else if (body.has("data")) {
            source = body.get("data");
        } else if (body.has("items")) {
            source = body.get("items");
        }

        if (!source.isArray()) {
            return List.of();
        }

        List<AttendanceTicket> out = new ArrayList<>();
        for (JsonNode item : source) {
            String ticketId = firstText(item, "ticketId", "idTicket", "ticket_id", "id");
            if (ticketId == null || ticketId.isBlank()) {
                continue;
            }
            String fecha = firstText(item, "fechaHoraIngreso", "fechaIngreso", "checkedInAt", "timestamp", "createdAt");
            String tipoAcceso = firstText(item, "tipoAcceso", "accessType", "tipo", "type");
            out.add(new AttendanceTicket(ticketId, parseDate(fecha), tipoAcceso != null ? tipoAcceso : "INGRESO"));
        }
        return out;
    }

    private String firstText(JsonNode node, String... fields) {
        for (String field : fields) {
            JsonNode value = node.get(field);
            if (value != null && !value.isNull()) {
                return value.asText();
            }
        }
        return null;
    }

    private LocalDateTime parseDate(String raw) {
        if (raw == null || raw.isBlank()) {
            return LocalDateTime.now();
        }
        try {
            return OffsetDateTime.parse(raw).toLocalDateTime();
        } catch (Exception ignored) {
            try {
                return LocalDateTime.parse(raw);
            } catch (Exception ignoredAgain) {
                return LocalDateTime.now();
            }
        }
    }

    public record AttendanceTicket(String ticketId, LocalDateTime fechaHoraIngreso, String tipoAcceso) {}
}

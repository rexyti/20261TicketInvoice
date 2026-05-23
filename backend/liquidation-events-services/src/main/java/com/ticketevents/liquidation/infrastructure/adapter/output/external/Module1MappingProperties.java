package com.ticketevents.liquidation.infrastructure.adapter.output.external;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Module1 integration settings.
 * Mapping example: external.module1.mapping.1=03c22676-5ea5-43e5-9c8d-1ccc59211e3c
 */
@ConfigurationProperties(prefix = "external.module1")
public class Module1MappingProperties {

    private Map<String, String> mapping = new HashMap<>();
    /** When false (default), external failures propagate and block liquidation (SC-003). */
    private boolean fallbackToJpa = false;
    /** Sends header required by ngrok free tier browser interstitial. */
    private boolean ngrokSkipBrowserWarning = true;

    public Map<String, String> getMapping() {
        return mapping;
    }

    public void setMapping(Map<String, String> mapping) {
        this.mapping = mapping;
    }

    public boolean isFallbackToJpa() {
        return fallbackToJpa;
    }

    public void setFallbackToJpa(boolean fallbackToJpa) {
        this.fallbackToJpa = fallbackToJpa;
    }

    public boolean isNgrokSkipBrowserWarning() {
        return ngrokSkipBrowserWarning;
    }

    public void setNgrokSkipBrowserWarning(boolean ngrokSkipBrowserWarning) {
        this.ngrokSkipBrowserWarning = ngrokSkipBrowserWarning;
    }
}

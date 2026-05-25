import ky, { isHTTPError } from "ky";
import { env } from "@/core/config/env";
import { ApiError, NetworkError } from "@/core/errors/ApiError";

export const api = ky.create({
  prefix: env.apiBaseUrl,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
  hooks: {
    beforeError: [
      async (state) => {
        const { error } = state;
        if (!isHTTPError(error)) return new NetworkError(error);

        const response = error.response;
        const body = await response.json().catch(() => ({}));
        const code = (body as { code?: string }).code ?? `HTTP_${response.status}`;
        const message = (body as { message?: string }).message ?? error.message;
        const details = (body as { details?: Record<string, string[]> }).details;

        return new ApiError(response.status, code, message, details);
      },
    ],
  },
});

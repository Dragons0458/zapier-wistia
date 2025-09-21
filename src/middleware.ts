import type {
  BeforeRequestMiddleware,
  AfterResponseMiddleware,
} from 'zapier-platform-core';

/**
 * Inject Authorization header from custom auth (api_key) for every request
 * @param request - The request object
 * @param z - The Zapier object
 * @param bundle - The bundle object
 * @returns The request object
 */
const injectAuthHeader: BeforeRequestMiddleware = (request, z, bundle) => {
  const apiKey = (bundle.authData as { api_key?: string } | undefined)?.api_key;
  if (apiKey && !request.headers?.Authorization) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${apiKey}`;
  }
  return request;
};

/**
 * Handle error responses, converting to meaningful Zapier errors
 * @param response - The response object
 * @param z - The Zapier object
 * @returns The response object
 */
const handleBadResponses: AfterResponseMiddleware = (response, z) => {
  if (response.status < 400) return response;

  let message = 'Request failed';
  try {
    const parsed = response.content ? JSON.parse(response.content) : undefined;
    const candidate = parsed?.message || parsed?.error || parsed?.description;
    if (typeof candidate === 'string' && candidate.length > 0) {
      message = candidate;
    }
  } catch {
    // ignore parse errors, fall back to defaults
  }

  if (response.status === 401 || response.status === 403) {
    throw new z.errors.Error(
      message || 'Unauthorized',
      'AuthenticationError',
      response.status,
    );
  }

  if (response.status === 429) {
    throw new z.errors.Error(
      message || 'Rate limited',
      'RateLimitError',
      response.status,
    );
  }

  throw new z.errors.Error(
    message || `HTTP ${response.status}`,
    'RequestError',
    response.status,
  );
};

export const befores = [injectAuthHeader];

export const afters = [handleBadResponses];

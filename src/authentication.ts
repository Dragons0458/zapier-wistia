import type { ZObject, Authentication } from 'zapier-platform-core';
import { WISTIA_BASE_URL } from './config/wistia.js';

/**
 * Make a request to an endpoint that is accessible to any authenticated user.
 * Returning the request object allows access to request/response for tests and
 * the connection label via `json.` prefix, e.g. `{{json.name}}`.
 */
const test = (z: ZObject) =>
  z.request({ url: `${WISTIA_BASE_URL}/v1/account.json` });

export default {
  /**
   * Custom auth to accept a single `api_key` for Wistia. The header is injected
   * via a global `beforeRequest` middleware.
   */
  type: 'custom',

  /**
   * Prompt user for the Wistia API key.
   */
  fields: [
    {
      key: 'api_key',
      label: 'API Key',
      required: true,
      type: 'string',
      helpText:
        'Wistia API token. It will be sent as Authorization: Bearer <api_key>.',
    },
  ],

  /**
   * Verify the provided API key by calling the Wistia account endpoint.
   */
  test,

  /**
   * Use account name if available. Avoid showing tokens or secrets here.
   */
  connectionLabel: '{{json.name}}',
} satisfies Authentication;

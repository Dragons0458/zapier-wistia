import { describe, expect, it, beforeEach, afterEach } from 'vitest';
// @ts-ignore
import nock from 'nock';
// @ts-ignore
import zapier, { type ZObject, type Bundle } from 'zapier-platform-core';

import App from '../index.js';
import { WISTIA_BASE_URL } from '../config/wistia.js';

const appTester = zapier.createAppTester(App);

type TestResponse = {
  status: number;
  request: { url: string; headers?: Record<string, string> };
};

describe('custom auth (api_key)', () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('adds Bearer Authorization header and hits account endpoint', async () => {
    const apiKey = 'test_api_key';
    const scope = nock(WISTIA_BASE_URL)
      .get('/v1/account.json')
      .matchHeader('authorization', `Bearer ${apiKey}`)
      .reply(200, { id: 1, name: 'Acme Inc' });

    const bundle: Partial<Bundle> = {
      authData: {
        api_key: apiKey,
      },
    };

    const response: TestResponse = await appTester(
      App.authentication?.test as (z: ZObject, bundle: Bundle) => TestResponse,
      bundle,
    );

    expect(response.status).toBe(200);
    expect(response.request.url).toBe(`${WISTIA_BASE_URL}/v1/account.json`);
    expect(scope.isDone()).toBe(true);
  });

  it('throws AuthenticationError on 401 with Wistia message', async () => {
    const apiKey = 'bad_api_key';
    const scope = nock(WISTIA_BASE_URL)
      .get('/v1/account.json')
      .matchHeader('authorization', `Bearer ${apiKey}`)
      .reply(401, { error: 'Unauthorized' });

    const bundle: Partial<Bundle> = {
      authData: {
        api_key: apiKey,
      },
    };

    try {
      await appTester(
        App.authentication?.test as (
          z: ZObject,
          bundle: Bundle,
        ) => TestResponse,
        bundle,
      );
    } catch (err) {
      // Zapier wraps to z.errors.Error; validate message
      expect((err as Error).message).toContain('Unauthorized');
      expect(scope.isDone()).toBe(true);
      return;
    }
    throw new Error('appTester should have thrown');
  });
});

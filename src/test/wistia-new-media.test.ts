import { describe, expect, it, beforeEach, afterEach } from 'vitest';
// @ts-ignore
import nock from 'nock';
// @ts-ignore
import zapier, { type ZObject, type Bundle } from 'zapier-platform-core';

import App from '../index.js';
import { WISTIA_BASE_URL } from '../config/wistia.js';

const appTester = zapier.createAppTester(App);

describe('trigger: Wistia New Media (polling)', () => {
  const apiKey = 'test_api_key';
  const bundleBase: Partial<Bundle> = {
    authData: { api_key: apiKey },
    inputData: {},
  };

  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('fetches medias with pagination and sorting', async () => {
    const scope = nock(WISTIA_BASE_URL)
      .get('/v1/medias.json')
      .query({ page: 1, per_page: 50, sort_by: 'created', sort_direction: '1' })
      .matchHeader('authorization', `Bearer ${apiKey}`)
      .reply(200, [
        { id: 2, hashed_id: 'b', created: '2024-01-02T00:00:00Z' },
        { id: 1, hashed_id: 'a', created: '2024-01-01T00:00:00Z' },
      ]);

    // Access perform function from trigger operation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const perform = (App.triggers.wistia_new_media.operation as any)
      .perform as (z: ZObject, bundle: Bundle) => unknown;

    const result = (await appTester(perform, bundleBase)) as Array<{
      id: string;
    }>;
    expect(result.length).toBe(2);
    // Returned sorted desc by created/updated
    expect(result[0].id).toBe('2');
    expect(result[1].id).toBe('1');
    expect(scope.isDone()).toBe(true);
  });

});

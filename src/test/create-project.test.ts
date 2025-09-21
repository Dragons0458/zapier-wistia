import { describe, expect, it, beforeEach, afterEach } from 'vitest';
// @ts-ignore
import nock from 'nock';
// @ts-ignore
import zapier, { type ZObject, type Bundle } from 'zapier-platform-core';

import App from '../index.js';
import { WISTIA_BASE_URL } from '../config/wistia.js';

const appTester = zapier.createAppTester(App);

describe('create project action', () => {
  const apiKey = 'test_api_key';
  const bundleBase: Partial<Bundle> = {
    authData: { api_key: apiKey },
    inputData: { name: 'My Project' },
  };

  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('creates a project successfully', async () => {
    const scope = nock(WISTIA_BASE_URL)
      .post('/v1/projects.json', { name: 'My Project' })
      .matchHeader('authorization', `Bearer ${apiKey}`)
      .reply(201, { id: 999, hashed_id: 'xyz999', name: 'My Project' });

    const perform = App.creates.wistia_create_project.operation.perform as (
      z: ZObject,
      bundle: Bundle,
    ) => unknown;

    const result = await appTester(perform, bundleBase);

    expect((result as { id: number }).id).toBe(999);
    expect(scope.isDone()).toBe(true);
  });

  it('throws validation error when name is missing', async () => {
    const bundle: Partial<Bundle> = {
      ...bundleBase,
      inputData: { name: '' },
    };

    const perform = App.creates.wistia_create_project.operation.perform as (
      z: ZObject,
      bundle: Bundle,
    ) => unknown;

    try {
      await appTester(perform, bundle);
    } catch (err) {
      expect((err as Error).message).toContain('Project name is required');
      return;
    }
    throw new Error('Expected validation error');
  });

  it('bubbles up API errors (401)', async () => {
    const scope = nock(WISTIA_BASE_URL)
      .post('/v1/projects.json', { name: 'My Project' })
      .matchHeader('authorization', `Bearer ${apiKey}`)
      .reply(401, { error: 'Unauthorized' });

    const perform = App.creates.wistia_create_project.operation.perform as (
      z: ZObject,
      bundle: Bundle,
    ) => unknown;

    try {
      await appTester(perform, bundleBase);
    } catch (err) {
      expect((err as Error).message).toContain('Unauthorized');
      expect(scope.isDone()).toBe(true);
      return;
    }
    throw new Error('Expected AuthenticationError');
  });
});

import type { ZObject } from 'zapier-platform-core';

import { WISTIA_BASE_URL } from '../config/wistia.js';
import type { WistiaProject } from '../types/wistia/project.js';

/**
 * Low-level repository for Wistia HTTP calls.
 * Uses global middlewares for auth and error handling.
 */
export const WistiaRepository = {
  /**
   * Create a new Wistia project.
   * @param z - Zapier object
   * @param params - Project creation params
   */
  async createProject(
    z: ZObject,
    params: { name: string },
  ): Promise<WistiaProject> {
    const response = await z.request({
      method: 'POST',
      url: `${WISTIA_BASE_URL}/v1/projects.json`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: params,
    });

    return z.JSON.parse(response.content) as WistiaProject;
  },
};

export type WistiaRepositoryType = typeof WistiaRepository;

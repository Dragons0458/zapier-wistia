import type { ZObject } from 'zapier-platform-core';

import { WistiaRepository } from '../repositories/wistia.js';
import type { WistiaProject } from '../types/wistia/project.js';

/**
 * Business logic for Wistia operations.
 */
export const WistiaService = {
  /**
   * Create a Wistia project
   * @param z - Zapier object
   * @param input - Input parameters
   */
  async createProject(
    z: ZObject,
    input: { name: string },
  ): Promise<WistiaProject> {
    return WistiaRepository.createProject(z, {
      name: input.name.trim(),
    });
  },
};

export type WistiaServiceType = typeof WistiaService;

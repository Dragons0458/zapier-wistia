import type { ZObject } from 'zapier-platform-core';

import { WistiaRepository } from '../repositories/wistia.js';
import type { WistiaProject } from '../types/wistia/project.js';
import type { WistiaMedia } from '../types/wistia/media.js';
import type { WistiaListMediasParams } from '../types/wistia/media-list-params.js';

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

  /**
   * List medias enforcing defaults and validating input values.
   */
  async listMedias(
    z: ZObject,
    input: WistiaListMediasParams,
  ): Promise<WistiaMedia[]> {
    const page = input.page && input.page > 0 ? input.page : 1;
    const per_page = input.per_page && input.per_page > 0 ? input.per_page : 50;

    let sort_by: 'created' | 'updated' | undefined;
    if (input.sort_by === 'created' || input.sort_by === 'updated') {
      sort_by = input.sort_by;
    }

    let sort_direction: 0 | 1 | undefined;
    if (input.sort_direction === 0 || input.sort_direction === 1) {
      sort_direction = input.sort_direction;
    }

    return WistiaRepository.listMedias(z, {
      page,
      per_page,
      sort_by: 'created',
      sort_direction: 1,
    });
  },
};

export type WistiaServiceType = typeof WistiaService;

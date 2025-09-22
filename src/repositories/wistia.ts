import type { ZObject } from 'zapier-platform-core';

import { WISTIA_BASE_URL } from '../config/wistia.js';
import type { WistiaProject } from '../types/wistia/project.js';
import type { WistiaMedia } from '../types/wistia/media.js';
import type { WistiaListMediasParams } from '../types/wistia/media-list-params.js';

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

  /**
   * Build query parameters for media listing, filtering out empty values.
   * @param params - Media listing parameters
   * @returns Record of query parameters
   */
  buildMediaListParams(
    params: WistiaListMediasParams,
  ): Record<string, string | number> {
    const paramsToSend: Record<string, string | number> = {};

    if (typeof params.page === 'number') paramsToSend.page = params.page;

    if (typeof params.per_page === 'number')
      paramsToSend.per_page = params.per_page;

    if (params.sort_by) paramsToSend.sort_by = params.sort_by;

    if (params.sort_direction)
      paramsToSend.sort_direction = params.sort_direction;

    if (params.project_id !== undefined && params.project_id !== null) {
      if (typeof params.project_id === 'string') {
        const trimmed = params.project_id.trim();
        if (trimmed !== '') paramsToSend.project_id = trimmed;
      } else {
        paramsToSend.project_id = params.project_id;
      }
    }

    return paramsToSend;
  },

  /**
   * List medias with pagination and optional sorting.
   * Sorting parameters are passed through as provided by the service.
   * @param z - Zapier object
   * @param params - Media listing parameters
   * @returns Array of media items
   */
  async listMedias(
    z: ZObject,
    params: WistiaListMediasParams,
  ): Promise<WistiaMedia[]> {
    const url = `${WISTIA_BASE_URL}/v1/medias.json`;
    const queryParams = this.buildMediaListParams(params);

    const response = await z.request({
      method: 'GET',
      url,
      params: queryParams,
    });

    return z.JSON.parse(response.content) as WistiaMedia[];
  },
};

export type WistiaRepositoryType = typeof WistiaRepository;

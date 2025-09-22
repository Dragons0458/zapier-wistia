/**
 * Input parameters for listing medias in Wistia.
 */
export type WistiaListMediasParams = {
  page?: number;
  per_page?: number;
  sort_by?: 'created' | 'updated';
  sort_direction?: 0 | 1;
  project_id?: string | number;
};

/**
 * Wistia Media representation returned by the API
 */
export interface WistiaMedia {
  id: number;
  hashed_id: string;
  name?: string;
  type?: string;
  project?: string | number;
  created?: string;
  updated?: string;
  duration?: number;
  thumbnail?: string | null;
  /** Allow other properties returned by Wistia without enforcing their shape */
  [key: string]: unknown;
}

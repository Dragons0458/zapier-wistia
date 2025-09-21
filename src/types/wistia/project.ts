/**
 * Wistia Project representation returned by the API
 */
export interface WistiaProject {
  id: number;
  hashed_id: string;
  name: string;
  created?: string;
  updated?: string;
  description?: string | null;
  // Allow other properties returned by Wistia without enforcing their shape
  [key: string]: unknown;
}

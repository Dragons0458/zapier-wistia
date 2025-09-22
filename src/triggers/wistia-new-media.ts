import type { Bundle, ZObject } from 'zapier-platform-core';
import {
  defineTrigger,
  defineInputFields,
  type PollingTriggerPerform,
} from 'zapier-platform-core';

import { WistiaService } from '../services/wistia.js';

// No input fields: we always fetch newest items by created desc
const inputFields = defineInputFields([] as const);

const perform: PollingTriggerPerform<typeof inputFields> = async (
  z: ZObject,
  bundle: Bundle,
) => {
  // Fetch with service defaults: page=1, per_page=50, sort_by=created, sort_direction=1
  const medias = await WistiaService.listMedias(z, {});

  // Return items in reverse chronological order by created date for stable deduping
  const items = [...medias]
    .sort((a, b) => {
      const aDate = a.created ?? '';
      const bDate = b.created ?? '';
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
    })
    .map((m) => ({ ...m, id: String(m.id ?? m.hashed_id) }));

  return items as Array<{ id: string }>;
};

export default defineTrigger({
  key: 'wistia_new_media',
  noun: 'Media',
  display: {
    label: 'New Media',
    description:
      'Triggers when a new media is available in Wistia. Returns newest first by created date.',
  },
  operation: {
    type: 'polling',
    perform,
    inputFields,
    sample: {
      id: 1001,
      hashed_id: 'abc123def',
      name: 'Sample Media',
      type: 'Video',
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z',
    },
    outputFields: [
      { key: 'id', type: 'string' },
      { key: 'hashed_id', type: 'string' },
      { key: 'name', type: 'string' },
      { key: 'type', type: 'string' },
      { key: 'created', type: 'datetime' },
      { key: 'updated', type: 'datetime' },
    ],
  },
});

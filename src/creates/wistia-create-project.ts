import type { Bundle, ZObject } from 'zapier-platform-core';
import {
  defineCreate,
  defineInputFields,
  type InferInputData,
  type BasicCreateOperation,
} from 'zapier-platform-core';

import { WistiaService } from '../services/wistia.js';
import type { WistiaProject } from '../types/wistia/project.js';

const inputFields = defineInputFields([
  {
    key: 'name',
    label: 'Project Name',
    helpText: 'Name of the project to create in Wistia.',
    required: true,
    type: 'string',
  },
]);

type Input = InferInputData<typeof inputFields>;

const perform: BasicCreateOperation<typeof inputFields>['perform'] = async (
  z: ZObject,
  bundle: Bundle,
) => {
  const input = (bundle.inputData ?? {}) as Input;

  if (!input.name || input.name.trim().length === 0) {
    throw new z.errors.Error(
      'Project name is required',
      'InputValidationError',
      400,
    );
  }

  const created = await WistiaService.createProject(z, { name: input.name });
  return created as WistiaProject;
};

export default defineCreate({
  key: 'wistia_create_project',
  noun: 'Project',
  display: {
    label: 'Create Project',
    description: 'Creates a new Wistia project.',
  },
  operation: {
    inputFields,
    perform,
    sample: {
      id: 123,
      hashed_id: 'abc123',
      name: 'New Project',
    },
    outputFields: [
      { key: 'id', type: 'integer' },
      { key: 'hashed_id', type: 'string' },
      { key: 'name', type: 'string' },
    ],
  },
});

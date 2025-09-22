import zapier, { defineApp } from 'zapier-platform-core';

import packageJson from '../package.json' with { type: 'json' };

import authentication from './authentication.js';
import { befores, afters } from './middleware.js';
import createWistiaProject from './creates/wistia-create-project.js';
import triggerWistiaNewMedia from './triggers/wistia-new-media.js';

export default defineApp({
  version: packageJson.version,
  platformVersion: zapier.version,

  authentication,
  beforeRequest: [...befores],
  afterResponse: [...afters],

  // Add your triggers here for them to show up!
  triggers: {
    wistia_new_media: triggerWistiaNewMedia,
  },

  // Add your creates here for them to show up!
  creates: {
    wistia_create_project: createWistiaProject,
  },
});

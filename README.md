## Zapier + Wistia Integration

Zapier integration for Wistia with API Key authentication and middlewares for error handling. TypeScript project with ESM (NodeNext) and unit tests using Vitest + Nock.

### Requirements and Installation
- Node.js and npm.
- Install dependencies:
```bash
npm install
```

### Scripts
- `npm run build`: cleans and compiles to `dist/` (TypeScript).
- `npm run test`: compiles and runs tests with Vitest.
- `npm run dev`: compiles in watch mode.
- `npm run lint` / `npm run lint:fix`: runs ESLint.
- `npm run format` / `npm run format:check`: Prettier.

Zapier CLI note: you can use `zapier validate` and `zapier push` from the Zapier CLI if you have it installed. Check the platform documentation for more details.

### Authentication (Wistia API Key)
- Type: Custom (`type: 'custom'`).
- Required field: `api_key` (string).
- Header: `Authorization: Bearer <api_key>` (injected by global middleware).
- Validation endpoint (test): `https://api.wistia.com/v1/account.json`.
- Connection label: `{{json.name}}`.

Relevant files:
- `src/authentication.ts`: defines the authentication type, `api_key` field, and `test` method.
- `src/config/wistia.ts`: centralized `WISTIA_BASE_URL`.

### Middlewares
- `beforeRequest` (`src/middleware.ts`):
  - Injects `Authorization: Bearer <api_key>` if not present.
- `afterResponse` (`src/middleware.ts`):
  - Converts responses >= 400 into Zapier errors (`z.errors.Error`).
  - Specific handling:
    - `401/403`: `AuthenticationError` with Wistia message if available.
    - `429`: `RateLimitError` respecting the returned message.

### Structure and ESM/TypeScript
- ESM NodeNext: `module: NodeNext`, `moduleResolution: NodeNext`, `target: ESNext`.
- Internal imports require the `.js` suffix at runtime (resolved by TS on compile).
- JSON import with attributes: `import packageJson from '../package.json' with { type: 'json' }` in `src/index.ts`.
- Source code in `src/`; output in `dist/`.
- `src/index.ts` registers `authentication`, `beforeRequest`, and `afterResponse`.

### Tests
- Framework: Vitest.
- Network mock: Nock (no real calls).
- Location: `src/test/`.
- Authentication test: `src/test/authentication.test.ts` validates:
  - `Authorization: Bearer <api_key>` header in `/v1/account.json`.
  - Handling of `401 Unauthorized` with Wistia message.

Run tests:
```bash
npm run test
```

### Resources
- Zapier Platform documentation: [Zapier Platform CLI README](https://github.com/zapier/zapier-platform/blob/main/packages/cli/README.md)
- Wistia API documentation: [Wistia Data API](https://wistia.com/support/developers/data-api)

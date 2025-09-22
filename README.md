## Zapier + Wistia Integration

Zapier integration for Wistia with API Key authentication and middlewares for error handling. TypeScript project with ESM (NodeNext) and unit tests using Vitest + Nock.

### Description & Scope

#### Wistia Data API Integration
- **API**: [Wistia Data API v1](https://wistia.com/support/developers/data-api) (JSON endpoints)
- **Purpose**: Wistia is a video hosting and analytics platform that allows businesses to host, manage, and analyze video content
- **Integration Focus**: Enables automated workflows between Wistia and other business tools through Zapier

#### Supported Use Cases

**1. Media Monitoring & Automation**
- **Trigger**: New Media Detection
  - Automatically detects when new videos/media are uploaded to Wistia
  - Enables downstream automation (notifications, content processing, analytics tracking)
  - Use case: Marketing teams can automatically trigger campaigns when new product videos are published

**2. Project Management & Organization**
- **Action**: Create Project
  - Programmatically create new Wistia projects for content organization
  - Enables automated project setup based on external triggers
  - Use case: Sales teams can automatically create project folders when new deals are closed

#### Technical Implementation
- **Stack**: Zapier CLI + TypeScript (ESM NodeNext), Vitest + Nock, ESLint + Prettier
- **Authentication**: **API Key** (Custom), injected with `Authorization: Bearer <api_key>` using `beforeRequest` middleware
- **Trigger (polling)**: *New Media* — lists media from `/v1/medias.json` and dedupes by `hashed_id` or `id` + `created`
- **Action**: *Create Project* — creates projects with `POST /v1/projects.json`

**Goal**: Deliver a minimal integration that **authenticates**, **detects new media** using **polling**, and **creates projects**, passing `zapier validate` and allowing `zapier push` for live testing.

### Challenge Requirements (practical summary)

- 1 working trigger + 1 working action
- Authentication + test call
- `zapier validate` passes
- `zapier push` succeeds
- Zap can be created and tested end‑to‑end


### Key Decisions & Trade‑offs

- **API Key vs OAuth**: API Key was chosen for **speed** and because Wistia supports full flows with a static key. OAuth would add unnecessary complexity and setup time.
- **Polling vs Webhooks**: Polling was selected to simplify development within the timebox. Webhooks are recommended later for near‑real‑time updates.
- **Pagination (page vs cursor)**: Used `page` parameter for simplicity. ⚠️ Limitation: defaulting to `page=1` (50 items) may miss data in high‑volume accounts. A future improvement is to iterate all pages or stop when encountering older `created_at` values.
- **Unit tests**: General tests cover auth and basic success/failure cases with Nock. Future edge cases to cover include: 401/403 empty body, 429 with retry‑after, 5xx flakiness, schema mismatches, and full pagination scanning.
- **Short prompts for AI**: Concise prompts were used because Cursor Rules provided enough context for structure and naming.

### Assumptions & Constraints

- **Time constraint**: 3-hour development window required prioritizing core functionality over edge cases.
- **API stability**: Assumed Wistia Data API v1 endpoints remain stable and consistent.
- **Account size**: Designed for typical Wistia accounts; high-volume accounts may need pagination improvements.
- **Error handling**: Basic error handling implemented; comprehensive retry logic and edge case handling deferred.
- **Authentication scope**: API Key provides sufficient access for required operations without OAuth complexity.
- **Zapier platform**: Assumed standard Zapier CLI workflow and validation requirements.

### AI Tools & Implementation Strategy

**Tools Used**: Cursor (primary IDE with AI assistance and documentation indexing) and ChatGPT (planning and strategic guidance)

#### Cursor AI Integration
- **Documentation indexing**: Used Cursor's built-in documentation indexing tool to automatically fetch and reference Zapier and Wistia API documentation
- **Context-aware development**: Leveraged Cursor's understanding of the codebase through workspace rules and file context
- **Code generation**: Used for rapid prototyping of TypeScript interfaces, service methods, and test cases
- **Refactoring assistance**: Applied for code organization and following Zapier platform conventions
- **Error resolution**: Helped debug TypeScript compilation issues and Zapier validation errors

#### ChatGPT Usage
- **Strategic planning**: Used for high-level project planning and understanding the challenge requirements
- **Decision making**: Consulted for choosing between different implementation approaches (API Key vs OAuth, polling vs webhooks)
- **Architecture guidance**: Helped determine the best practices and project structure for Zapier integrations
- **Process optimization**: Provided step-by-step guidance on how to proceed with the development workflow

#### Example Prompts Used

**Planning & Strategy**:
```text
You're an expert in Zapier and Wistia API
Based on the information that I'm sharing in the PDF, give me the top 5 actions and the top 5 triggers that I can create to complete this challenge
Add, the Wistia endpoint that I need to use to each of them, for triggers, I'm going to use polling instead of webhooks to decrease the complexity of the challenge
Order it from the easiest one to the harder one
Remember that, I only have 3 hours to complete this
```

**Architecture & Best Practices**:
```text
List me the best practices that I need to have, to develop a clean project with Zapier CLI and Wistia API
```

**Project Setup**:
```text
Give me the step by step to create the Zapier project, that it's the base that I'm going to use to develop the solution
```

**Authentication Implementation**:
```text
# Docs
- @Zapier 
- @Wistia 
# Instructions
I need to implement authentication in Wistia with `api_key` in @authentication.ts and @authentication.test.ts for my new integration in Zapier
# Endpoint to test auth (test method)
- https://api.wistia.com/v1/account.json
```

**Trigger Development**:
```text
# Docs
- @Zapier 
- @Wistia 
# Instructions
I need to implement a trigger, using polling to get `New Media` in Wistia, this trigger shouldn't have input params because is only to know if we have new media or no.
# Endpoint (GET)
https://api.wistia.com/v1/medias.json
```

**Documentation & PR Creation**:
```text
Based on @Branch (Diff with Main Branch) this changes
Give me a title and a description to create a PR in MD style
```

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
- `src/index.ts` registers `authentication`, `beforeRequest`, `afterResponse`, and creates.

### Directory Structure
```
zapier-wistia/
├── src/                          # Source code (TypeScript)
│   ├── authentication.ts         # Zapier authentication configuration
│   ├── index.ts                  # Main entry point, registers all components
│   ├── middleware.ts             # Request/response middlewares
│   ├── config/
│   │   └── wistia.ts            # Wistia API configuration (base URL)
│   ├── creates/                  # Zapier create actions
│   │   └── wistia-create-project.ts
│   ├── repositories/             # Data access layer
│   │   └── wistia.ts            # Wistia API client
│   ├── services/                 # Business logic layer
│   │   └── wistia.ts            # Wistia service operations
│   ├── triggers/                 # Zapier trigger actions
│   │   └── wistia-new-media.ts
│   ├── types/                    # TypeScript type definitions
│   │   └── wistia/
│   │       ├── media-list-params.ts
│   │       ├── media.ts
│   │       └── project.ts
│   └── test/                     # Unit tests (Vitest)
│       ├── authentication.test.ts
│       ├── create-project.test.ts
│       └── wistia-new-media.test.ts
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.js              # ESLint configuration
└── README.md                     # This file
```

### Triggers

- New Media (Wistia)
  - Path: `src/triggers/wistia-new-media.ts`
  - Description: Polls `GET /v1/medias.json` every 5 minutes (Zapier schedule) to detect new media items. Always returns newest first by created date.
  - Input fields: none
  - Output sample:
    ```json
    { "id": 1001, "hashed_id": "abc123def", "name": "Sample Media", "type": "Video" }
    ```

### Creates

- Create Project (Wistia)
  - Path: `src/creates/wistia-create-project.ts`
  - Description: Creates a new Wistia project using `POST /v1/projects.json`.
  - Input fields:
    - `name` (string, required) - Project name.
  - Output sample:
    ```json
    { "id": 123, "hashed_id": "abc123", "name": "New Project" }
    ```

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

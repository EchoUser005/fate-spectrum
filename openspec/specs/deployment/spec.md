# deployment Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
### Requirement: Local development
The repository SHALL document and support local setup with pnpm install and pnpm dev.

#### Scenario: Developer starts local app
- **GIVEN** dependencies are installed
- **WHEN** a developer runs pnpm dev
- **THEN** the Next.js app starts on a local port and the report workbench can submit real-provider generation with a configured model key

### Requirement: CI validation
The repository SHALL include GitHub Actions that install dependencies, install OpenSpec, validate specs, lint, test, and build.

#### Scenario: Pull request validation
- **GIVEN** a contributor opens a pull request
- **WHEN** CI runs
- **THEN** openspec validate, pnpm lint, pnpm test, and pnpm build are executed

### Requirement: Vercel deployment
The repository SHALL include Vercel deployment guidance and configuration for stateless BYOK deployment.

#### Scenario: Vercel import
- **GIVEN** the GitHub repository is imported into Vercel
- **WHEN** the default build command runs
- **THEN** the app builds without requiring a site-owned LLM key

### Requirement: Docker deployment
The repository SHALL include Dockerfile and docker-compose configuration exposing the app on port 3000.

#### Scenario: Docker compose starts app
- **GIVEN** Docker is available
- **WHEN** docker compose up -d is run
- **THEN** the application is served on port 3000

### Requirement: Deployment guide completeness
The repository SHALL document GitHub Actions CI, Vercel manual import, Docker Compose deployment, and future server auto-publish prerequisites.

#### Scenario: Maintainer chooses a deployment path
- **GIVEN** a maintainer reads docs/deployment.md
- **WHEN** they choose CI, Vercel, Docker Compose, or future server deployment
- **THEN** they can identify the commands, defaults, and required secrets without needing to provide server information during public demo hardening

### Requirement: Disabled server deployment template
The repository SHALL include a server auto-deployment workflow template that is disabled or manual-only by default and documented as not safe to enable until secrets and server hardening are configured.

#### Scenario: Workflow cannot deploy accidentally
- **GIVEN** code is pushed to the repository
- **WHEN** GitHub Actions evaluates workflows
- **THEN** the server deployment template does not automatically deploy to a server without an explicit manual trigger or documented enabling step

### Requirement: Server deployment secret placeholders
The repository SHALL document reserved server deployment secrets without requiring current values.

#### Scenario: Future server deployer finds required secrets
- **GIVEN** server deployment is deferred
- **WHEN** a maintainer reads the workflow template and deployment guide
- **THEN** they see placeholders for DEPLOY_HOST, DEPLOY_USER, DEPLOY_PORT, DEPLOY_PATH, and SSH_PRIVATE_KEY

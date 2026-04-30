# deployment Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
### Requirement: Local development
The repository SHALL document and support local setup with pnpm install and pnpm dev.

#### Scenario: Developer starts local app
- **GIVEN** dependencies are installed
- **WHEN** a developer runs pnpm dev
- **THEN** the Next.js app starts on a local port and Mock Demo can generate a report

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


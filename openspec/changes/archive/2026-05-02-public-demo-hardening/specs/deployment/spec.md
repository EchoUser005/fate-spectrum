## ADDED Requirements

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

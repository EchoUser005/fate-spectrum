# collaboration Specification

## Purpose
TBD - created by archiving change public-demo-hardening. Update Purpose after archive.
## Requirements
### Requirement: Contributor guide
The repository SHALL include a CONTRIBUTING guide that requires reading AGENTS.md, creating OpenSpec changes before new features, using branch naming conventions, testing core logic, and running the full validation command set before submission.

#### Scenario: Contributor starts work safely
- **GIVEN** a new contributor wants to implement a feature
- **WHEN** they read CONTRIBUTING.md
- **THEN** they learn to read AGENTS.md, create an OpenSpec change first, name branches as feature/<change-id>, fix/<issue>, or chore/<task>, add tests for core logic, and run openspec validate, lint, test, build, and e2e commands before PR

### Requirement: Pull request template
The repository SHALL provide a pull request template requiring OpenSpec change id, scope, test results, risks, and screenshots or recordings for UI changes.

#### Scenario: PR includes review context
- **GIVEN** a contributor opens a pull request
- **WHEN** they fill the template
- **THEN** reviewers can see the OpenSpec change id, changed scope, validation results, known risks, and UI evidence when relevant

### Requirement: Issue templates
The repository SHALL provide bug report and feature request templates that capture reproducible context and OpenSpec expectations for future work.

#### Scenario: Issue captures enough detail
- **GIVEN** a user files a bug or feature request
- **WHEN** they use the GitHub issue templates
- **THEN** maintainers receive expected behavior, actual behavior or proposal, reproduction or acceptance context, and relevant environment details


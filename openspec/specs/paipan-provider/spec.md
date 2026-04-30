# paipan-provider Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
### Requirement: Mock provider
The system SHALL include a mock paipan provider that returns an anonymous sample paipan response without requiring an API key.

#### Scenario: Mock demo succeeds
- **GIVEN** the user selects Mock Demo
- **WHEN** the paipan endpoint is called
- **THEN** it returns the sample paipan response and normalized data

### Requirement: Custom paipan provider
The system SHALL support POST calls to user-provided paipan endpoints and normalize the response into the PaipanResponse contract.

#### Scenario: Custom endpoint returns compatible response
- **GIVEN** a user provides an allowed HTTPS paipan endpoint
- **WHEN** the provider returns compatible JSON
- **THEN** the system maps or passes through data.zw, data.bz, and data.output for report generation

### Requirement: Shenjige request mapping
The system SHALL support the shenjige form-encoded request mapping for solar birth dates, male/female gender, and time branch values.

#### Scenario: Shenjige form body is built
- **GIVEN** solar birth input with male or female gender
- **WHEN** the custom provider endpoint is the shenjige getPlateArrangement URL
- **THEN** the request body contains year, month, day, hour, genderValue, settings fields, and zzpAnalysis in form-encoded format

### Requirement: Provider input limitations
The system SHALL prevent unsupported real-provider calls for lunar calendar input or other/unknown gender in the MVP.

#### Scenario: Unsupported real-provider input
- **GIVEN** the user selects the real custom provider with lunar calendar or unsupported gender
- **WHEN** report generation is requested
- **THEN** the system returns a clear validation error instead of calling the external provider

### Requirement: SSRF protections
The system SHALL block insecure protocols, localhost, loopback addresses, and private network addresses for custom endpoints by default.

#### Scenario: Localhost endpoint is blocked
- **GIVEN** ALLOW_INSECURE_PROVIDER_ENDPOINT is false
- **WHEN** a custom paipan endpoint points to localhost or a private IP
- **THEN** the provider rejects the request before network access


## ADDED Requirements

### Requirement: Live shenjige response calibration
The system SHALL support one anonymous local live shenjige calibration request that verifies required response field presence without recording API keys, private input, or the full raw response.

#### Scenario: Anonymous live calibration records field presence only
- **GIVEN** a developer has local shenjige access and anonymous solar birth input
- **WHEN** the calibration request is executed
- **THEN** the recorded result only summarizes whether status, message, data.zw, data.bz, data.bz.y, data.bz.m, data.bz.d, data.bz.h, data.bz.dayunGZ, data.bz.dayunAge, data.bz.dayunYear, and data.output are present

### Requirement: Shenjige response normalization compatibility
The system SHALL normalize compatible shenjige responses into the internal PaipanResponse and NormalizedPaipan contracts while tolerating missing optional fields that do not block report generation.

#### Scenario: Compatible shenjige response is normalized
- **GIVEN** a shenjige response contains the required BaZi, Ziwei, dayun, and output fields or compatible optional omissions
- **WHEN** normalization runs
- **THEN** the report pipeline receives normalized pillars, palace data, dayun windows, output text, and raw provider data without hardcoding a full live fixture

### Requirement: Malformed shenjige response rejection
The system SHALL reject malformed shenjige responses with a clear sanitized error before scoring or rendering.

#### Scenario: Malformed response fails safely
- **GIVEN** a shenjige response is missing required data containers or has incompatible field types
- **WHEN** the provider response is parsed or normalized
- **THEN** the system returns a clear sanitized error and does not compute spectrum scores from invalid data

### Requirement: Shenjige unsupported input errors
The system SHALL reject shenjige requests for lunar calendar input or unknown/unsupported gender before making the external request.

#### Scenario: Unsupported input is rejected before network call
- **GIVEN** the selected provider is the shenjige endpoint and the birth input uses lunar calendar or gender unknown
- **WHEN** the paipan or report endpoint is called
- **THEN** the response contains a clear unsupported-input error and no external shenjige request is attempted

### Requirement: True solar time prompt
The system SHALL surface a true-solar-time prompt when useTrueSolarTime is enabled without coordinates, while allowing Mock Demo generation to continue.

#### Scenario: Mock demo continues with true solar time prompt
- **GIVEN** the user selects Mock Demo with useTrueSolarTime enabled and no latitude or longitude
- **WHEN** report generation is requested
- **THEN** the system provides a non-blocking true-solar-time prompt and still generates the sample report

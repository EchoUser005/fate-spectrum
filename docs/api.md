# API

## GET /api/health

Response:

```json
{
  "ok": true,
  "version": "0.1.0-rule-spectrum"
}
```

## POST /api/paipan

Request:

```json
{
  "birth": "BirthInput",
  "provider": "ProviderConfig"
}
```

Response:

```json
{
  "paipan": "PaipanResponse",
  "normalized": "NormalizedPaipan"
}
```

## POST /api/report

Request:

```json
{
  "birth": "BirthInput",
  "paipanProvider": "ProviderConfig",
  "llmProvider": "ProviderConfig",
  "options": {
    "useLlmNarrative": true,
    "includeRawJson": true
  }
}
```

Response: `ReportResponse`.

## Error Shape

```json
{
  "error": "sanitized message"
}
```

## Provider Contract

`PaipanProvider.generate(input, config)` returns `Promise<PaipanResponse>`.

Custom JSON endpoints receive:

```json
{
  "birth": "BirthInput",
  "options": {
    "includeZiwei": true,
    "includeBazi": true,
    "includeDayun": true,
    "includeLiunian": true
  }
}
```

The shenjige endpoint receives form-encoded fields documented in README.

### Shenjige Calibration Notes

The local anonymous calibration on 2026-04-30 confirmed that the shenjige endpoint returns HTTP 200 with JSON. A failed mapping can still return a JSON body with numeric `status`, `message`, and no usable `data.bz` or `data.zw`.

Successful form submissions require:

```text
year
month
day
hour
h
m
genderValue
settings[sihua]
settings[brightness]
settings[isShowDStarBright]
settings[JKXK]
settings[RYType]
settings[RYTypeM45]
zzpAnalysis
```

Successful response field presence was verified for:

- `status` as a number
- `message` as a string
- `data.zw` as an array
- `data.bz` as an object
- `data.bz.y`
- `data.bz.m`
- `data.bz.d`
- `data.bz.h`
- `data.bz.dayunGZ`
- `data.bz.dayunAge`
- `data.bz.dayunYear`
- `data.output` as an object

The repository does not store the full live response. Tests use only anonymous minimal fixtures.

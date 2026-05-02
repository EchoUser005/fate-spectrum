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

The built-in real-provider path is implemented server-side and keeps raw provider responses out of the product UI. The repository does not store full live responses. Tests use only anonymous minimal fixtures.

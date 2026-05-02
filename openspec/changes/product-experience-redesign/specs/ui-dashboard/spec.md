## ADDED Requirements

### Requirement: Community chart-backed spectrum overview
The dashboard SHALL use community chart components from the existing Recharts/shadcn-chart-compatible stack for primary spectrum visualization.

#### Scenario: Dimension shape is shown as a chart
- **GIVEN** a report has seven spectrum dimensions
- **WHEN** the report renders
- **THEN** the primary spectrum overview uses a Recharts-backed chart to show the dimension shape and avoids custom hand-built chart primitives for that view

### Requirement: Report action plan prominence
The dashboard SHALL show next actions and important timing windows before technical chart-source sections.

#### Scenario: User sees actions before source data
- **GIVEN** a report has narratives and key windows
- **WHEN** the dashboard renders
- **THEN** action plan and near-term windows appear before BaZi, Ziwei, and raw JSON source panels

---
platform: Rhino/Grasshopper
category: Urban & district energy
developer: Ladybug Tools LLC
url: "https://www.ladybug.tools/dragonfly.html"
license: open-source
status: published
aliases:
  - "Dragonfly[+]"
  - dragonfly-energy
  - Dragonfly for Grasshopper
metrics:
  - "[[Energy use intensity]]"
  - "[[Rooftop PV generation]]"
  - "[[On-site renewable energy share]]"
  - "[[Urban heat island effect]]"
  - "[[Operational carbon]]"
auto_case_studies: []
auto_references: []
auto_strategies: []
---

## What it does

Ladybug Tools plugin for urban and district energy modelling built from 2D footprints/floor plates. It is the main Rhino/Grasshopper front end for NREL's URBANopt SDK, adding OpenDSS grid analysis, REopt PV/battery optimisation and urban heat island correction of weather files.

## What it can calculate

- District-scale annual energy use (via URBANopt/OpenStudio/EnergyPlus)
- Peak loads and demand response across districts
- Electrical grid / transformer and feeder loading (OpenDSS)
- Cost-optimal PV and battery sizing (REopt)
- Urban heat island-adjusted weather files (Urban Weather Generator, UWG)
- Operational carbon emissions (US grid carbon intensity)

## Status

Active; distributed in Ladybug Tools 1.x (2026). AGPL-3.0.

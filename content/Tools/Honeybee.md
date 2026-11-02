---
platform: Rhino/Grasshopper
category: Energy simulation
developer: Ladybug Tools LLC
url: "https://www.ladybug.tools/honeybee.html"
license: open-source
status: published
aliases:
  - "Honeybee[+]"
  - honeybee-energy
  - honeybee-radiance
  - Honeybee for Grasshopper
metrics:
  - "[[Energy use intensity]]"
  - "[[Heating energy demand]]"
  - "[[Daylight autonomy]]"
  - "[[Thermal comfort]]"
  - "[[Rooftop PV generation]]"
  - "[[Operational carbon]]"
auto_case_studies: []
auto_references: []
---

## What it does

Ladybug Tools plugin that turns Rhino/Grasshopper geometry into detailed building-physics models and runs them through EnergyPlus/OpenStudio (energy, HVAC, comfort) and Radiance (daylight, glare, radiation). It is the main validated-engine simulation layer of the suite, covering energy use, loads, annual daylight metrics and spatial comfort mapping.

## What it can calculate

- Annual energy use / End Use Intensity (EUI, kWh/m²)
- Heating and cooling loads, peak loads and HVAC sizing
- Annual daylight metrics: Daylight Autonomy (DA), continuous DA (cDA), Useful Daylight Illuminance (UDI)
- Annual Sun Exposure (ASE)
- Point-in-time illuminance
- Daylight Glare Probability (DGP)
- High-accuracy solar radiation with reflections
- Indoor thermal comfort maps / adaptive comfort
- Outdoor microclimate comfort maps

## Status

Active; distributed in Ladybug Tools 1.x (latest lbt-grasshopper v1.10.53, 2026-08-18). AGPL-3.0.

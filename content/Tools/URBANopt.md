---
platform: Python/CLI
category: Urban & district energy
developer: "National Laboratory of the Rockies (formerly NREL; renamed Dec 2025), copyright Alliance for Energy Innovation, LLC, for US DOE"
url: "https://docs.urbanopt.net/"
license: open-source
status: published
aliases:
  - URBANopt SDK
  - URBANopt CLI
metrics:
  - "[[Energy use intensity]]"
  - "[[Rooftop PV generation]]"
  - "[[On-site renewable energy share]]"
  - "[[Operational carbon]]"
auto_case_studies: []
auto_references: []
auto_strategies: []
---

## What it does

Open-source SDK from the US DOE national lab ecosystem for modelling energy at district and campus scale. It takes a GeoJSON description of buildings and runs scenarios combining building energy, grid, renewable optimisation and district thermal systems. It is aimed at developers and analysts; Dragonfly is a common front end.

## What it can calculate

- District/campus multi-building energy use and hourly load profiles (OpenStudio/EnergyPlus)
- Distribution-grid power flow and impacts (OpenDSS, DISCO)
- Cost-optimal PV, storage and DER sizing (REopt)
- District thermal energy systems incl. 4th/5th-generation and ground-source networks (GeoJSON-Modelica Translator)
- Rooftop/canopy PV potential
- Scenario comparison of individual vs shared district HVAC

## Status

Active; urbanopt-cli v1.3.0 released 2025-06-29 (OpenStudio 3.10). NREL renamed National Laboratory of the Rockies in Dec 2025.

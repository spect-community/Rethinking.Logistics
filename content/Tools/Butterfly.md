---
platform: Rhino/Grasshopper
category: Wind & CFD
developer: "Ladybug Tools (original author Mostapha Sadeghipour Roudsari; early prototype by Theodore Galanos)"
url: "https://www.ladybug.tools/butterfly.html"
license: open-source
status: published
aliases:
  - butterfly (Ladybug Tools)
  - Butterfly CFD
metrics:
  - "[[Pedestrian-level wind speed]]"
  - "[[Natural ventilation potential]]"
auto_case_studies: []
auto_references: []
auto_strategies: []
---

## What it does

Plugin and Python library that sets up and runs OpenFOAM computational fluid dynamics cases from Grasshopper or Dynamo geometry, for urban wind studies and indoor airflow. It was the CFD member of the Ladybug Tools family.

## What it can calculate

- Outdoor wind flow / wind velocity fields around buildings (OpenFOAM RANS/LES)
- Indoor airflow and natural ventilation
- Buoyancy-driven flows (atria, chimneys)
- Inputs for indoor/outdoor thermal comfort
- Draft discomfort from HVAC

## Status

Effectively unmaintained/legacy: Grasshopper version 0.0.05 last updated 2019; users report it still works with blueCFD-Core 2017-2 + Rhino 7, and a 2023 forum post states it 'hasn't been maintained for years'. Not mentioned in LBT 1.7 (2023) or 1.8 (2024) release notes. The food4rhino Ladybug Tools page still lists it. Python library is GPL-3.0.

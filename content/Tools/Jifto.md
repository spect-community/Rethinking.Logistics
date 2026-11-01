---
platform: Rhino
category: Climate & solar analysis
developer: Nflection ApS (originated at Henning Larsen)
url: https://jifto.com/
license: freemium (free 30 min/day; Pro €80/month; Team €60/user/month)
status: published
aliases: []
metrics:
  - "[[Sun exposure of outdoor space]]"
  - "[[Wind conditions]]"
  - "[[Pedestrian-level wind speed]]"
  - "[[Thermal comfort]]"
  - "[[Visual impact on neighbours]]"
auto_case_studies: []
---

## What it does

Rhino 8 plugin for sustainable site analysis that runs directly in the Rhino viewport, without Grasshopper scripting. A *Start* step places the project at a real location and imports terrain, surrounding buildings, trees and weather/climate data in one go. Separate modules then analyse sunlight, wind, outdoor thermal comfort, stormwater, earthworks and views. Simulations run on the GPU, so results update quickly enough for early massing studies.

## What it can calculate

- **Sunlight and shadow** – sun hours and shadow positions on terrain and façades (GPU ray tracing, 1 m grid, clear sky).
- **Wind** – pedestrian-level wind speed and speed-up, and comfort classes under the Lawson (default), NEN 8100 or LDDC criteria. It uses Lattice-Boltzmann CFD over 8–16 directions weighted by the site's wind rose, and also shows the wind rose and its statistics.
- **Microclimate** – outdoor thermal comfort as UTCI (°C, heat- and cold-stress classes) on a 1 m grid. It combines sun, shade and the CFD wind field, and can use a future climate (2050, SSP2-4.5).
- **Stormwater** – surface runoff flow paths, ponding depth (mm) and flow velocity (m/s) for a design rainfall intensity (mm/h).
- **Earthworks** – cut and fill volumes (m³), the imbalance between them, and area by cut/fill depth.
- **Views** – view coverage (%) and the fraction of a target that is visible, from eye points or across façades.

## Data sources

- **Weather:** ERA5-Land reanalysis, the Copernicus Interactive Climate Atlas, and SSP2-4.5 projections.
- **Buildings:** OpenStreetMap, Overture Maps and national/city LOD2 models.
- **Terrain:** national DTMs, or ESRI Terrain 3D as a fallback.
- **Trees:** Overture Maps and OpenStreetMap.

## Limitations

- **Stormwater** routes water over the surface only. Pipes, soakaways and evapotranspiration are not modelled, so the module checks design storms but does not size drainage. It does not give the runoff-coefficient comparison used for [[Stormwater runoff reduction]].
- **Sunlight** assumes a clear sky, and only geometry included in the context casts shadows or blocks views.
- **Biodiversity** module is announced but still in development.

## Status

Active commercial product. Rhino 8 only, and no Grasshopper components are documented. Facts taken from jifto.com and its documentation (October 2026). Not yet used in any case study.

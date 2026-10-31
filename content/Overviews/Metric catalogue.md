---
title: Metric catalogue
description: "All metrics with their unit and calculation method."
---

> [!abstract] Generated page
> All metrics with their unit and calculation method. Rebuilt automatically from the properties of all notes — edit the notes, not this page.

**76 metrics**, grouped by category. *Origin* says whether students defined the metric themselves, adapted it, or took it from a standard such as BREEAM, LEED or DGNB.

## Biodiversity

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[Biodiversity net gain]] | % change in biodiversity units | (Post-development biodiversity units − baseline units) ÷ baseline × 100, where units = habitat area × distinctiveness × condition (e.g. the UK statutory metric). | [[Rhino.Ecologic]] | 7 | adapted · UK Biodiversity Net Gain metric |
| [[Biotope area factor]] | index 0–1 | Σ(area of each surface type × its ecological weighting factor) ÷ total site area (Berlin BAF method). | [[Grasshopper]] | 1 | adapted · Berlin Biotope Area Factor (BAF) |
| [[Ecological connectivity]] | qualitative (connected / not connected) | Mapping whether site greenery links to nearby corridors, water bodies and habitats (distance and continuity of green links). | — | 2 | student |
| [[Function stacking index]] | index 1–5 (or % of surface area with ≥ 2 functions) | Σ(area of each surface × number of functions it serves) ÷ total surface area (ground + roof + facade). Functions: logistics operation, stormwater handling, habitat, human amenity, energy. | — | 0 | adapted |
| [[Green area ratio]] | % of site (or m²) | Vegetated area ÷ total site area × 100. | [[Grasshopper]], [[Lands Design]] | 11 | student |
| [[Green plot ratio]] | index | Total leaf area (leaf area index × planted area) ÷ site area. | — | 1 | adapted |
| [[Green roof coverage]] | % of roof area | Vegetated roof area ÷ total roof area × 100. | [[Grasshopper]] | 3 | student |
| [[Native species richness]] | number of species | Count of native plant (or animal) species supported on site, from planting plan or survey. | [[Rhino.Ecologic]] | 4 | student |
| [[Tree count and canopy cover]] | trees/ha or % canopy | Number of trees (or crown area) on site ÷ site area; compared before and after the design. | [[Lands Design]] | 3 | student |

## Carbon

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[Biodiversity stress from materials]] | PDF·m²·year | Life-cycle impact on species loss caused by material extraction and production (potentially disappeared fraction of species), calculated in LCA software. | [[One Click LCA]] | 1 | adapted |
| [[Carbon per pallet handled]] | kgCO2e/pallet | Annual (operational or whole-life) carbon ÷ pallets handled per year. | — | 1 | student |
| [[Carbon sequestration by planting]] | tCO2/ha·year | Planted area × sequestration rate of the vegetation type (from literature). | — | 2 | adapted |
| [[Carbon usage effectiveness]] | kgCO2e/kWh (IT) | Total CO2 emissions caused by the facility's energy use ÷ IT equipment energy. | — | 1 | standard · The Green Grid |
| [[Design for disassembly score]] | score 0–10 | Checklist score: dry/reversible connections, standard modules, material passports, separable layers. | — | 1 | adapted |
| [[Embodied carbon intensity]] | kgCO2e/m² | Material quantities × emission factors from EPDs/databases, summed over life-cycle modules (A1–A3 or A1–C4) ÷ gross floor area. Calculated with LCA tools such as One Click LCA or Bombyx. | [[Bombyx]], [[CO2mpare]], [[LearnCarbon]], [[One Click LCA]] | 9 | standard · EN 15978 |
| [[Embodied carbon saved by reuse]] | tCO2e | Embodied carbon of an equivalent new building − embodied carbon of the retrofit (reused structure counted as zero or reduced). | [[One Click LCA]] | 3 | adapted |
| [[Last-mile delivery emissions]] | tCO2/year | Vehicle-km per year for each delivery mode × emission factor of that mode (kgCO2/km). | — | 3 | adapted |
| [[Life-cycle impact by stage]] | % of total impact per module | LCA result split by EN 15978 modules (A1–A3, A4, A5, B, C) for each impact indicator. | [[One Click LCA]] | 1 | standard · EN 15978 |
| [[Material reuse share]] | % (or count of reused elements) | Reused or recycled material (by mass, volume or number of elements) ÷ total material × 100. | — | 2 | student |
| [[Operational carbon]] | kgCO2e/m²·year | Annual energy use per energy carrier × emission factor of that carrier (e.g. grid kgCO2e/kWh). | [[Dragonfly]], [[Honeybee]], [[nPro]], [[URBANopt]] | 6 | standard |
| [[Whole-life carbon]] | tCO2e/year (annualised) | (Embodied carbon + operational carbon over the reference period) ÷ number of years. | [[CO2mpare]], [[One Click LCA]] | 1 | adapted · EN 15978 |

## Comfort

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[Daylight autonomy]] | % of occupied hours | Share of occupied hours in which a point reaches a target illuminance (e.g. 300 lux) from daylight alone, simulated with Radiance-based tools. | [[Honeybee]], [[Pollination]] | 2 | standard · DA300 / EN 17037 |
| [[Indoor air quality]] | ppm CO2 | Indoor CO2 concentration as a proxy for ventilation quality; target e.g. below 900 ppm. | — | 1 | standard · WELL |
| [[Natural ventilation potential]] | % of floor area / hours | Share of floor area (or hours) that can be ventilated naturally, based on opening area, depth and climate. | [[Butterfly]] | 1 | adapted |
| [[Noise level]] | dB(A) | Noise mapping (from municipal noise maps or simulation) at façades and outdoor spaces; reduction compared with the existing state. | [[Geoportal Praha]] | 4 | student |
| [[Pedestrian-level wind speed]] | m/s | CFD simulation of wind around the buildings at about 1.5 m height for prevailing wind directions; compared with comfort criteria (e.g. Lawson). | [[Butterfly]], [[Eddy3D]], [[Jifto]] | 1 | adapted · Lawson criteria |
| [[Sun exposure of outdoor space]] | % of area or hours of direct sun | Sunlight-hours analysis on the ground plane for key days (e.g. equinox, summer solstice). | [[Cyclops]], [[Jifto]], [[Ladybug]] | 2 | student |
| [[Thermal comfort]] | PMV / UTCI / % in comfort zone | Indoor: Predicted Mean Vote (PMV) or adaptive comfort; outdoor: Universal Thermal Climate Index (UTCI), simulated from weather data. | [[Eddy3D]], [[Honeybee]], [[Jifto]], [[Ladybug]], [[Pollination]] | 1 | standard · EN 16798 / ASHRAE 55 |
| [[Urban heat island effect]] | °C above reference | Surface or air temperature difference to a rural reference, simulated or from satellite maps. | [[Dragonfly]] | 2 | student |
| [[Wind conditions]] | m/s and % of hours by direction | Wind rose from a weather file (EPW) or wind atlas: frequency of wind speeds per direction. | [[Eddy3D]], [[Jifto]], [[Ladybug]] | 2 | standard |
| [[Worker well-being]] | score / % satisfied | Post-occupancy survey or checklist score of daylight, views, rest areas, greenery and facilities for workers. | — | 4 | student |

## Economy

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[CapEx–OpEx ratio]] | % / % over 30 years | Investment cost vs. sum of operating costs over a 30-year life (undiscounted or as net present value). | [[One Click LCA]] | 3 | student |
| [[Construction cost]] | EUR/m² | Cost estimate per gross floor area; or cost of a building element (e.g. envelope) derived from its quantity. | [[Galapagos]] | 2 | student |
| [[Electricity price]] | CZK/kWh or EUR/kWh | Business electricity tariff at the project location, including grid fees. | — | 3 | standard |
| [[Last-mile delivery cost]] | EUR/delivery or % change | Total cost of the final delivery step ÷ number of deliveries. | — | 2 | adapted |
| [[Social cost of carbon]] | EUR | Total emissions (tCO2e) × a carbon price per tonne. | [[One Click LCA]] | 1 | standard |

## Energy

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[Energy per package delivered]] | kWh/package | Energy used by the delivery mode over a route ÷ number of packages delivered. | — | 1 | adapted |
| [[Energy use intensity]] | kWh/m²·year | Annual delivered energy ÷ gross floor area. Simulated (e.g. Honeybee/EnergyPlus) or taken from metered data or benchmarks. | [[Dragonfly]], [[Honeybee]], [[Pollination]], [[URBANopt]] | 9 | standard · NZEB / EU benchmarks |
| [[Heat recovery radius]] | m | Distance within which recovered heat can be delivered usefully: available heat output vs. heat losses of the connecting network per metre. | — | 1 | student |
| [[Heating energy demand]] | kWh/year | Sum of space-heating demand over a year; simulated, or estimated from heated volume × heat-loss coefficient × degree days. | [[Honeybee]], [[nPro]], [[Pollination]] | 1 | student |
| [[On-site renewable energy share]] | % of demand | On-site renewable generation ÷ total annual energy demand × 100. | [[Dragonfly]], [[nPro]], [[URBANopt]] | 4 | student |
| [[Power usage effectiveness]] | ratio (≥ 1.0) | Total facility energy ÷ energy used by the IT equipment. 1.0 would mean zero overhead for cooling and power distribution. | — | 2 | standard · The Green Grid / ISO/IEC 30134-2 |
| [[Rooftop PV generation]] | MWh/year | Usable roof area × annual solar irradiation (kWh/m²) × module efficiency × performance ratio. Irradiation from solar radiation analysis (Ladybug, Cyclops) or PVGIS. | [[Cyclops]], [[Dragonfly]], [[Honeybee]], [[Ladybug]], [[URBANopt]] | 4 | student |
| [[Waste heat recovery]] | MWh/year | Heat produced by IT or process load × recoverable share (e.g. 80 %), compared with the heat demand of nearby users. | [[nPro]] | 2 | student |

## Location

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[Delivery catchment]] | km or minutes | Radius (distance or travel time) a hub can serve with a given vehicle; number of hubs needed to cover a city. | — | 2 | adapted |
| [[Distance to housing]] | m or % of program beyond buffer | Distance from noisy or hazardous logistics functions to the nearest residential building; or share of such functions outside a buffer zone. | [[Geoportal Praha]], [[Grasshopper]] | 3 | student |
| [[Land take]] | m² or % of site | Building footprint (plus paved operational area) ÷ site area; compared before and after. | [[Grasshopper]] | 6 | student |
| [[Public transport accessibility]] | m (walking distance) or score | Walking distance from the entrance to the nearest stops, or a score by transport mode (walk, bike, tram, bus, car). | [[Geoportal Praha]] | 1 | student |
| [[Walkability]] | score | Walk Score-type index, or a custom score of route continuity, crossings and destinations within walking distance. | — | 3 | adapted · Walk Score |

## Logistics operations

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[Adaptability]] | time or effort to reconfigure | Time (or cost) to reconfigure, extend or relocate the building or its partitions; checked against module dimensions and connections. | — | 5 | student |
| [[Delivery time]] | hours/minutes | Time from order or dispatch to delivery at the customer; or end-to-end cycle time in the supply chain. | — | 2 | adapted |
| [[Dock turnaround time]] | minutes | Time from a truck's arrival at the gate until departure (or until goods enter processing). | — | 2 | adapted |
| [[Level of automation]] | employees per facility / % automated tasks | Share of handling tasks done by machines, or number of employees needed per facility at a given throughput. | — | 1 | student |
| [[Number of docks]] | docks | Docks needed to handle a given throughput, from queueing or discrete-event simulation. | — | 1 | student |
| [[Parking capacity]] | spaces or m² | Number of car/truck parking spaces (or parking area) provided, and their utilisation. | — | 4 | student |
| [[Road freight impact]] | % of emissions / road wear | Share of freight moved by trucks vs. their share of transport emissions; road wear per truck in car equivalents (fourth-power law). | — | 1 | adapted |
| [[Space utilisation]] | % of floor area / storage capacity | Floor area (or volume) actively used for storage and operations ÷ total. | [[Grasshopper]] | 3 | student |
| [[Throughput per site area]] | units/m²·day | Goods handled (parcels, pallets, tonnes) per day ÷ site area. | — | 3 | student |
| [[Truck throughput]] | trucks/hour | Trucks handled per hour (or day), counted in a simulation or from operational data. | — | 2 | student |
| [[Yard area per dock]] | m²/dock (or % of site) | Paved manoeuvring and apron area ÷ number of docks; apron depth checked with vehicle swept-path analysis. | [[AutoTURN]] | 1 | student |

## Safety

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[Pedestrian–vehicle conflict points]] | count (or % separated routes) | Number of points where pedestrian routes cross truck or van routes, counted on the site plan; or share of routes that are fully separated. | — | 4 | student |
| [[Worker safety incidents]] | incidents/year | Recorded incidents per year (or hazard zones per layout) in operational areas. | — | 3 | student |

## Social

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[Green space per visitor]] | m²/person | Accessible green space ÷ expected daily users or visitors. | — | 1 | student |
| [[Green-core anchoring of mixed uses]] | % of entrances (or frontage length) | Building entrances (or ground-floor frontage length) of all uses within a set walking distance (e.g. 100 m) of a shared green spine ÷ total entrances (or frontage length). | — | 0 | adapted |
| [[Jobs created]] | jobs | Number of jobs (FTE) created on site, by function. | — | 2 | student |
| [[Mixed-use ratio]] | % of floor area | Floor area of non-logistics uses (retail, workshops, community, offices) ÷ total floor area. | — | 5 | student |
| [[Publicly accessible area]] | m² or % of site | Area freely open to the public (plazas, parks, roofs, ground-floor uses) ÷ site area. | [[Grasshopper]] | 8 | student |
| [[Social acceptance]] | qualitative / survey score | Resident and user survey, or qualitative assessment, of whether the logistics activity is perceived as a benefit rather than a nuisance. | — | 2 | student |
| [[Social interaction index]] | users/day | Observed or estimated number of people using the public spaces of the project per day. | — | 3 | student |
| [[Visual impact on neighbours]] | % of view obstructed / screened | Share of the view from neighbouring windows obstructed by the building, or share of the built perimeter visually screened (by greenery or design). | [[Jifto]], [[Ladybug]] | 7 | student |

## Structure

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[Structural utilisation]] | % of capacity / kN/m² | Loads (dead, live, snow per Eurocode) and the resulting utilisation of structural members, from hand calculation or finite-element analysis. | [[Donkey]], [[Karamba3D]] | 1 | standard · Eurocode |

## Water

| Metric | Unit | How it is calculated | Tools | Used in | Origin |
| --- | --- | --- | --- | --- | --- |
| [[Impervious surface ratio]] | % of site | Sealed (paved, built, roofed without retention) area ÷ total site area × 100. The permeable ratio is the complement. | [[Grasshopper]] | 5 | student |
| [[Stormwater retention volume]] | m³ | Sum of the storage capacity of green roofs, swales, ponds and tanks; or design rainfall × area × (1 − runoff coefficient). | — | 3 | student |
| [[Stormwater runoff reduction]] | % vs. baseline | (Runoff before − runoff after) ÷ runoff before. Runoff = runoff coefficient × design rainfall × area, summed over surface types. | [[Rainflow-Sim]] | 4 | student |
| [[Water consumption]] | m³/year | Metered or estimated annual water use; for data centres often normalised per kWh of IT energy (WUE). | — | 2 | student |
| [[Water reuse share]] | % of demand | Reused rain or grey water ÷ total water demand × 100. | — | 4 | student |

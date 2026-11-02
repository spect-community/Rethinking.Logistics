---
student: Lindsay Daphne Macuja
project: Humanizing Logistics
portfolio: https://heyzine.com/flip-book/1c11e500f0.html
portfolio_pdf: "https://github.com/spect-community/Rethinking.Logistics/blob/main/portfolios/Lindsay%20Daphne%20Macuja.pdf"
studio: AD2 (Architectural Design 2)
year: 2026
location: Strojírenská 175/25, 155 21 Zličín, Prague, Czech Republic
typology: last-mile logistics hub with public market, local businesses and offices (multi-tenant hybrid), replacing an existing big-box warehouse
status: published
aliases: []
challenges:
  - "[[Embodied carbon and adaptive reuse of logistics buildings]]"
  - "[[Biodiversity and ecological connectivity on logistics sites]]"
  - "[[Pedestrian–truck safety on logistics sites]]"
ambitions:
  - "[[Urban integration of logistics buildings]]"
metrics:
  - "[[Distance to housing]]"
  - "[[Green area ratio]]"
  - "[[Biodiversity net gain]]"
  - "[[Embodied carbon intensity]]"
  - "[[Social cost of carbon]]"
  - "[[Energy use intensity]]"
  - "[[On-site renewable energy share]]"
  - "[[Mixed-use ratio]]"
  - "[[CapEx–OpEx ratio]]"
  - "[[Green-core anchoring of mixed uses]]"
tools:
  - "[[One Click LCA]]"
  - "[[Grasshopper]]"
auto_insights:
  - "[[In-city logistics is a separate typology with separate rules]]"
  - "[[Residential and logistics cannot share a block; offices and retail can]]"
auto_strategies:
  - "[[Regenerative Peripheral Park]]"
---
![[Pasted image 20261031083257.png]]
## Project

The site is an existing 13,029 m² sawtooth-roof 'big box' warehouse in a mixed industrial–residential district of Zličín, causing noise, truck congestion, single-point access and a hostile edge to housing and schools. The project reframes it as a last-mile logistics hub that is also a civic asset, structured around the Society–Economy–Environment triad. Key moves are a reworked sawtooth roof carrying PV and daylight, a green roof over the public-facing programme, shops/markets and offices along the park edge, a landscaped green–blue buffer linking two lakes, and a low-carbon material palette (25% GGBS concrete, 97% recycled reinforcement) verified in One Click LCA. A Grasshopper script was used to locate storage away from residential zones (distance buffer index).

## How the student framed the challenge

- Urban integration of logistics buildings
- Embodied carbon of warehouse structures
- Biodiversity and green–blue connectivity on logistics sites
- Mixed-use / social value of logistics hubs

## Metrics and evidence

Every metric the project used, as named by the student, with the value, the calculation and the portfolio page.

| Metric | Student's wording | Value | How it was calculated | Tool | Page |
| --- | --- | --- | --- | --- | --- |
| [[Distance to housing]] | distance buffer index | Baseline 25% → proposal 85% | Parametric script tests spatial iterations of the storage volume and scores how well each location maximises distance from sensitive residential areas. | Grasshopper | 9 |
| [[Green area ratio]] | green environment | Baseline 35% → proposal 70% | Share of site/buffer programmed as landscaped green space; method not explained. | not stated | 9 |
| [[Biodiversity net gain]] | lake biodiversity | Baseline 15% → proposal 85% | Qualitative score based on introduced vegetation zones (emergent, riparian, aquatic, wet meadow plants); calculation not explained. | not stated | 10 |
| [[Embodied carbon intensity]] | low carbon materials (kg CO2e/m²) | Baseline 420 → proposal 354 kgCO2e/m² (Carbon Class B) | Whole-life LCA of structure and envelope in One Click LCA; comparison of conventional materials with 25% GGBS concrete and 97% recycled-content reinforcement. | One Click LCA | 10 |
| [[Embodied carbon intensity]] | Tonnes CO2e | 5,172 tCO2e; A1–A3 ≈89%, B4–B5 6%, A4 2%, C3 2%, C2 1%; foundations/substructure 43%, horizontal structures 31%, vertical structures and façade 27% | Sum of life-cycle GWP over modules A1–A4, B4–B5, C1–C4 in One Click LCA. | One Click LCA | 10 |
| [[Embodied carbon intensity]] | kg CO2e/m²/year | 5 kgCO2e/m²/year | Embodied carbon divided by floor area and reference study period, output of One Click LCA. | One Click LCA | 10 |
| [[Social cost of carbon]] | Social cost of carbon | 258,618 € (text claims mitigation of over $258,000) | Monetised embodied emissions reported by One Click LCA. | One Click LCA | 10 |
| [[Energy use intensity]] | Energy Use Intensity (EUI) analysis | Monthly peaks approx. 75,000 kWh in January/December; approx. 45,000–50,000 kWh in summer (read from chart) | Energy simulation of zoned massing (program types supermarket/produce, large office, medium office/storage), split into heating, cooling, lighting and technology per month. | Grasshopper energy model (Honeybee program types – visual inference) | 12, 20 |
| [[On-site renewable energy share]] | energy offset | Baseline 102.5 kW → energy offset 69.7 kW | Comparison of baseline demand with demand offset by PV arrays on the sawtooth roof; method not explained. | not stated | 12 |
| [[Mixed-use ratio]] | economic & social use | Baseline 50% → proposal 80% | Share of building/edge given to public-facing shops, markets, small businesses and community uses; method not explained. | not stated | 12 |
| [[CapEx–OpEx ratio]] | CapEx/OpEx ratio | ≈60% CapEx / 40% OpEx (estimate); business electricity price assumed 4.70 CZK/kWh | Qualitative estimate: higher construction cost for smaller modules offset by lower operating cost from daylight and natural ventilation. | manual / formula | questionnaire (Economy 1, Economy 3) |

## Tools

- [[One Click LCA]] — Whole-life embodied carbon, carbon class, social cost of carbon, material comparison
- [[Grasshopper]] — Spatial optimisation script placing storage away from residential zones (distance buffer index); energy/EUI massing model
- [[Honeybee]] *(probable — inferred from the graphics, not named)* — Energy model with OpenStudio program types (2019::SuperMarket::Produce, 2019::LargeOffice::ClosedOffice, 2013::MediumOffice::Storage) – visual inference

## Trade-offs

- Breaking the warehouse into smaller human-scale modules improves daylight and safety but increases façade area by about 30%, raising embodied carbon and construction cost (questionnaire).
- More building edges and public-facing modules improve street activity but increase maintenance and long-term operational cost (questionnaire).

## Decision

The One Click LCA comparison supported choosing low-carbon concrete with 25% GGBS and 97% recycled steel reinforcement (420 → 354 kgCO2e/m², class B). The distance-buffer script set storage at the back of the site, away from housing, and the energy profile supported putting PV on the sawtooth roof. Comparing typologies (cross-dock, regional and national DC) supported keeping last-mile logistics as the only one that fits the residential context.

## Open questions

- Concept moved too fast without enough site layers or evidence on ecology and species movement between the two lakes (mid-term consultation).
- Lacked deeper research and a clear approach before starting the concept.
- KPI understanding and evidence base need more study; not enough alternatives tested (no second variant at the other end of the modularity trade-off).
- Methods behind the percentage KPIs (green environment, lake biodiversity, economic & social use) are not documented; energy offset is given in kW without explaining whether this is peak power or energy.

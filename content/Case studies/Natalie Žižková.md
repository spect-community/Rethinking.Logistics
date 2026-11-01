---
student: Natalie Žižková
project: "Invisible Logistics (strategy: CCC / 3C Method – Conceal, Connect, Coexist)"
portfolio: https://heyzine.com/flip-book/9a59dbf685.html
portfolio_pdf: "https://github.com/spect-community/Rethinking.Logistics/blob/main/portfolios/Natalie%20%C5%BDi%C5%BEkov%C3%A1.pdf"
studio: AD2 (Architectural Design 2)
year: 2026
location: McKenna Logistics, 1260 Lakeshore Rd E, Lakeview Village, Mississauga, Ontario, Canada
typology: existing 3PL distribution centre / logistics hub retrofitted with mixed-use (offices, insurance, physiotherapy) in a regenerating residential district
status: published
aliases: []
challenges:
  - "[[Urban integration of logistics buildings]]"
  - "[[Pedestrian–truck safety on logistics sites]]"
  - "[[Stormwater and sealed surfaces on logistics sites]]"
  - "[[Public access and community use of logistics sites]]"
metrics:
  - "[[Pedestrian–vehicle conflict points]]"
  - "[[Parking capacity]]"
  - "[[Green area ratio]]"
  - "[[Impervious surface ratio]]"
  - "[[Tree count and canopy cover]]"
  - "[[Water reuse share]]"
  - "[[Publicly accessible area]]"
  - "[[Walkability]]"
  - "[[Construction cost]]"
  - "[[Energy use intensity]]"
  - "[[Green-core anchoring of mixed uses]]"
tools:
  - "[[Grasshopper]]"
  - "[[Galapagos]]"
auto_insights: []
auto_strategies:
  - "[[Regenerative Peripheral Park]]"
---
![[Pasted image 20261031084932.png]]
![[Pasted image 20261031085016.png]]
## Project

An active logistics centre sits inside a former coal-power-station area that is being redeveloped into a green residential district, creating unsafe truck–pedestrian conflicts and cutting two public parks apart. The concept 'Invisible Logistics' aims to make the facility read as landscape rather than industry. Key moves are an artificial green hill and stepped walkable green roof terraces over the warehouse, a timber façade wrapping the building, a pedestrian tunnel and bridge linking the separated parks, and strict zoning that keeps the truck yard apart from staff and public routes. A Grasshopper geometry optimiser minimised envelope perimeter for a fixed 5,000 m² usable area and estimated façade costs, and a monthly energy simulation checked operational demand.

## How the student framed the challenge

- Urban integration of logistics buildings
- Truck–pedestrian safety and site zoning
- Reconnecting fragmented public green space
- Stormwater and impervious surfaces on logistics sites

## Metrics and evidence

Every metric the project used, as named by the student, with the value, the calculation and the portfolio page.

| Metric | Student's wording | Value | How it was calculated | Tool | Page |
| --- | --- | --- | --- | --- | --- |
| [[Pedestrian–vehicle conflict points]] | Pedestrian-Truck Crossing Points / Staff–Truck Crossing Points | Existing 4 → proposed 0 | Count of locations where pedestrian/staff/public routes intersect truck routes, mapped on the site flow-analysis plan for existing vs proposed layout. | manual / formula | 6, 7, 9, 21 |
| [[Parking capacity]] | Parking Capacity Provided / Staff Parking Capacity | Existing 70 → proposed 80 | Count of car parking spaces on the site plan. | manual / formula | 21 |
| [[Green area ratio]] | Green Area Ratio | Existing 5% → proposed 40% | Green (vegetated) area divided by total site area. | not stated | 21 |
| [[Impervious surface ratio]] | Impervious Surface Ratio | Existing 85% → proposed 40% | Sealed/impervious surface area divided by total site area. | not stated | 21 |
| [[Tree count and canopy cover]] | Tree Planting Density | Existing 5 → proposed 45 trees/ha | Number of trees divided by site area in hectares. | not stated | 21 |
| [[Water reuse share]] | Rainwater Reuse Potential | Existing 0% → proposed 65% | Share of rainwater captured and reused; method not explained. | not stated | 21 |
| [[Publicly accessible area]] | Publicly Accessible Roof Area | Existing 0 → proposed 1,800 m² | Area of walkable roof terraces open to the public, measured in the model. | not stated | 21 |
| [[Walkability]] | Connected Public Pathways | Existing 0 → proposed 350 m | Length of new public pedestrian routes (hill, tunnel, bridge, roof) linking the surrounding parks. | not stated | 21 |
| [[Construction cost]] | Facade Perimeter Optimization | 0 → 12% reduction | Evolutionary solver minimises total wall length for a fixed 5,000 m² usable area (penalty for deviating from target area); reduction of perimeter vs baseline footprint. | Grasshopper (Galapagos evolutionary solver) | 12, 21 |
| [[Construction cost]] | Facade price / window price / final price | Computed live in the script; numbers not legible | Script computes façade area from height × perimeter, window area from a glazing percentage, multiplies each by a unit price and sums to a final envelope price. | Grasshopper | 12 |
| [[Energy use intensity]] | Energy performance simulation (kWh) | Peak approx. 110,000 kWh in January (heating-dominated); summer peak approx. 83,000 kWh in July (cooling); lowest approx. 52,000–55,000 kWh in May/Sep/Oct (values read from chart) | Building energy simulation of the proposed volume, broken down into heating, cooling, lighting and technology per month. | Grasshopper energy simulation (plugin not named) | 13, 23 |

## Tools

- [[Grasshopper]] — Parametric geometry optimiser for building dimensions and envelope cost estimation; monthly energy simulation
- [[Galapagos]] — Evolutionary solver minimising perimeter at fixed 5,000 m² usable area

## Trade-offs

- Not stated explicitly; the geometry optimiser balances façade perimeter (cost, heat loss) against the fixed usable-area target of 5,000 m².

## Decision

The crossing-point and flow analysis led to a strict two-zone layout (truck area vs public/staff area) with zero pedestrian–truck crossings. The geometry optimiser fixed a compact footprint with about 12% less façade perimeter, and greening/permeability KPIs supported the green hill, intensive green roof and accessible roof terraces.

## Open questions

- Questionnaire KPIs such as truck turnaround time, dock accessibility efficiency, expansion potential, renewable energy potential and site utilisation efficiency are not quantified in the portfolio.
- Calculation methods for rainwater reuse potential and green/impervious ratios are not documented.
- No embodied carbon / LCA or biodiversity net gain calculation.

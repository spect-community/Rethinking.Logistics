---
summary: "A simulation of truck arrivals tests how many docks keep the same throughput, and swept paths of real trucks fix the size of the bays."
method: "Discrete-event simulation (custom; software not named) and AutoTURN swept-path analysis"
status: published
aliases: []
case_studies:
  - "[[Hynek Hrabík]]"
metrics:
  - "[[Number of docks]]"
  - "[[Truck throughput]]"
  - "[[Yard area per dock]]"
tools:
  - "[[AutoTURN]]"
auto_ambitions:
  - "[[Compact footprint]]"
  - "[[Efficient truck flow and compact yards]]"
  - "[[Habitat and ecological connectivity]]"
  - "[[Rainwater kept on site]]"
---

## The question it answers

How few docks and how little paved yard can handle the same number of trucks?

## How it works

1. Simulate truck arrivals and dock handling many times for each docking layout and number of docks.
2. Compare the distribution of trucks handled, to find the smallest number of docks that keeps throughput.
3. Generate swept paths of standard trucks to check and size the bays and turning areas.
4. Turn the paved area that is no longer needed into greenery or water retention.

## In the student projects

- [[Hynek Hrabík]] — *discrete-event simulation (custom; software not named) and AutoTURN*. [[Number of docks]]: classic layout 60 docks vs flow-through 40 docks at equal throughput; [[Truck throughput]]: flow-through 40 docks centred near 250 trucks handled, overlapping the 60-dock case (250 trucks/hour arrival rate, 2,000 runs per configuration). Decision: “The simulation showed flow-through docking keeps full throughput with a third fewer docks, and the swept-path analysis fixed the bay size. Together they justified replacing conventional apron docking at the PPL hub with flow-through corridors: 20 fewer docks and about 30% less paved surface (18,000 to 13,000 m²), with the freed area turned into greenery and ponds.”

Values and decisions as reported by the student; see each case study for the page in the portfolio.

## Where it falls short

- Only one project uses this workflow, and the simulation software is not named.
- [[Dock turnaround time]] is shown only as a bar chart, without a value.

> [!tip] Where are the ambitions, metrics and tools?
> They appear automatically below under **Connections**, and in Obsidian under the `auto_` properties.

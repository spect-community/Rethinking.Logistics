---
summary: "A parametric model generates many variants of the building mass and lets a solver or score pick the one that best meets a target."
method: "Grasshopper parametric model, with the Galapagos evolutionary solver"
status: published
aliases: []
case_studies:
  - "[[Natalie Žižková]]"
  - "[[Lindsay Daphne Macuja]]"
  - "[[Adam Večeřa]]"
metrics:
  - "[[Construction cost]]"
  - "[[Distance to housing]]"
  - "[[Land take]]"
tools:
  - "[[Grasshopper]]"
  - "[[Galapagos]]"
auto_ambitions:
  - "[[Access without a car]]"
  - "[[Compact footprint]]"
  - "[[Green and productive roofs]]"
  - "[[Habitat and ecological connectivity]]"
  - "[[Logistics as part of the city]]"
  - "[[Low embodied carbon]]"
  - "[[Mixed use and function stacking]]"
  - "[[Multi-storey logistics]]"
  - "[[Public access and community use]]"
  - "[[Rainwater kept on site]]"
  - "[[Safe sites with separated flows]]"
  - "[[Screening with greenery and façades]]"
---

## The question it answers

Which building shape or position best meets a measurable target, such as less façade, less land or more distance from housing?

## How it works

1. Build a parametric model of the mass, with the floor area fixed as a constraint.
2. Define the target as a number the script can compute, such as wall length, envelope cost or distance from housing.
3. Let an evolutionary solver or a scoring script search the variants.
4. Fix the chosen geometry and check its energy or carbon in a later step.

## In the student projects

- [[Natalie Žižková]] — *Grasshopper with Galapagos*. [[Construction cost]]: 12% reduction of the façade perimeter for a fixed 5,000 m² usable area. Decision: “The geometry optimiser fixed a compact footprint with about 12% less façade perimeter.”
- [[Lindsay Daphne Macuja]] — *Grasshopper*. [[Distance to housing]]: baseline 25% → proposal 85%. Decision: “The distance-buffer script set storage at the back of the site, away from housing.”
- [[Adam Večeřa]] — *Grasshopper / Rhino parametric model*. [[Land take]]: ~120,000 m² freed for public park and ecology. Decision: “The KPI targets … supported stacking the IKEA program vertically to free ground for a public park, pond and an east–west ecological corridor.”

Values and decisions as reported by the student; see each case study for the page in the portfolio.

## Where it falls short

- In [[Natalie Žižková]]'s project the envelope prices computed in the script are not legible in the portfolio.
- The case studies do not report the energy or carbon effect of the optimised shape against the baseline shape.

> [!tip] Where are the ambitions, metrics and tools?
> They appear automatically below under **Connections**, and in Obsidian under the `auto_` properties.

---
summary: "Wind data and simulation test how the arrangement and orientation of volumes shelter outdoor space or channel wind for cooling."
method: "Ladybug wind rose and Eddy3D CFD simulation in Grasshopper"
status: published
aliases: []
case_studies:
  - "[[Sara Sulollari]]"
  - "[[Robin Jesenský]]"
metrics:
  - "[[Pedestrian-level wind speed]]"
  - "[[Wind conditions]]"
tools:
  - "[[Ladybug]]"
  - "[[Eddy3D]]"
  - "[[Grasshopper]]"
auto_ambitions:
  - "[[Compact footprint]]"
  - "[[Logistics as part of the city]]"
  - "[[Low embodied carbon]]"
  - "[[Low energy and water demand]]"
  - "[[Modular and prefabricated architecture]]"
  - "[[Outdoor comfort]]"
---

## The question it answers

Which arrangement and orientation of the volumes gives shelter, or catches the wind where it is wanted?

## How it works

1. Plot a wind rose from a weather file for the site, by season if wind changes over the year.
2. Model layout variants and simulate wind speed at pedestrian height (about 1.5 m) with CFD.
3. Compare the variants with a reference wind speed and check that corners do not accelerate the wind.
4. Choose and orient the layout that gives the needed shelter or airflow.

## In the student projects

- [[Sara Sulollari]] — *Ladybug and Eddy3D in Grasshopper*. [[Pedestrian-level wind speed]]: typical waterfront 6.0 m/s vs proposal 3.97 m/s; [[Wind conditions]]: winter wind up to about 25.2 m/s, strongest from the east. Decision: “The wind simulations showed the U-shaped container layout gave the strongest shelter, so it was chosen for the container wind buffer, with corners softened below 90° to avoid speeding up the wind.”
- [[Robin Jesenský]] — *Ladybug in Grasshopper, and a wind atlas map*. [[Wind conditions]]: ≈9.82 m/s at 100 m height; speeds 0.5–27.3 m/s, calm 1.75% of the time. Decision: “Wind data (wind atlas and Ladybug wind rose) supported siting the data centre on a windy, non-protected coastal location near Grindavík and orienting the modular shells to capture ground wind for passive air cooling.”

Values and decisions as reported by the student; see each case study for the page in the portfolio.

## Where it falls short

- [[Robin Jesenský]] uses wind data to site and orient the building; no airflow simulation of the shells is reported.
- Neither case study reports a pedestrian comfort criterion, such as Lawson, for the wind speeds.

> [!tip] Where are the ambitions, metrics and tools?
> They appear automatically below under **Connections**, and in Obsidian under the `auto_` properties.

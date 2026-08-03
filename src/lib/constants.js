export const WASTE_TYPES = ["Electricity", "Water", "Waste", "Recycling", "Transportation", "Food", "Paper", "Chemicals"];

// Filters for the curated resource directory, matched against the
// `category` column (which holds ~80 raw spreadsheet tab names) via keyword
// search rather than an exact match, so one filter can cover several
// related tabs at once. Covers every imported spreadsheet tab except two
// generic catch-all sheets ("More resources", "Resources by category
// questions") that don't fit a specific topic — those are still reachable
// via the free-text search box.
export const CURATED_RESOURCE_FILTERS = [
  { label: "Rebates & Incentives", keywords: ["rebate", "incentive"] },
  { label: "Financing & Grants", keywords: ["financ", "grant", "tax credit", "bank"] },
  { label: "Energy & Solar", keywords: ["energy", "solar", "renewable", "efficien", "led"] },
  { label: "Heating & Cooling", keywords: ["heat", "cooling", "hvac", "weatheriz"] },
  { label: "Water", keywords: ["water", "rainwater"] },
  { label: "Recycling & Waste", keywords: ["recycl", "waste", "compost"] },
  { label: "EV & Transportation", keywords: ["ev charg", "transport", "fleet"] },
  { label: "Climate & Emergency", keywords: ["climate", "emergency", "resilience", "carbon"] },
  { label: "Air Quality & Pollution", keywords: ["air quality", "pollut", "emission"] },
  { label: "Food & Agriculture", keywords: ["food", "agricultur"] },
  { label: "Green Building & Construction", keywords: ["green building", "building", "construction", "envelope", "maintenance"] },
  { label: "Land & Wildlife Conservation", keywords: ["land conservation", "habitat", "wildlife", "biodiversity", "forestry"] },
  { label: "Environmental Health & Justice", keywords: ["environmental health", "environmental justice"] },
  { label: "Circular Economy & Materials", keywords: ["circular economy", "materials"] },
  { label: "Policy & Advocacy", keywords: ["policy", "advocacy", "government"] },
  { label: "Workforce & Green Jobs", keywords: ["workforce", "green job", "employee", "training", "wellness"] },
  { label: "Business & Sustainability Programs", keywords: ["business", "corporat", "purchasing", "packaging", "supply", "certification", "marketing", "customer", "technical assistance", "operational", "reduction categor", "organization type", "facility type", "industry", "office", "paperless", "cost"] },
  { label: "Events & Community", keywords: ["event", "community", "club", "hyper local"] },
  { label: "Youth & Education", keywords: ["youth", "school", "knowledge"] },
];

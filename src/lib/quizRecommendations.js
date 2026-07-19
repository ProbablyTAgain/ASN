export const ORG_TYPE_OPTIONS = [
  "Retail",
  "Restaurant / Food Service",
  "Manufacturing",
  "Office / Professional Services",
  "Healthcare",
  "Construction",
  "Hospitality",
  "Nonprofit",
  "Other",
];

export const EMPLOYEE_COUNT_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "500+"];

export const SUSTAINABILITY_STEP_OPTIONS = [
  { value: "recycling", label: "Set up recycling programs" },
  { value: "composting", label: "Started composting organic waste" },
  { value: "energy", label: "Reduced energy consumption" },
  { value: "sourcing", label: "Sourced sustainable materials or suppliers" },
  { value: "waste_audit", label: "Conducted a waste audit" },
  { value: "other", label: "Something else" },
];

export const TOOLS_USED_OPTIONS = [
  { value: "waste_hauler", label: "Third-party waste hauler" },
  { value: "recycling_program", label: "Municipal recycling program" },
  { value: "consultant", label: "Sustainability consultant" },
  { value: "tracking_software", label: "Sustainability tracking software" },
  { value: "certification", label: "Green certification program" },
  { value: "other", label: "Something else" },
  { value: "none", label: "None of the above" },
];

export const CHALLENGES_OPTIONS = [
  { value: "cost", label: "Cost of implementation" },
  { value: "time", label: "Lack of time or staff" },
  { value: "knowledge", label: "Not sure where to start" },
  { value: "vendor_access", label: "Trouble finding verified vendors or partners" },
  { value: "leadership_buyin", label: "Getting leadership buy-in" },
  { value: "other", label: "Something else" },
];

export const SUPPORT_OPTIONS = [
  { value: "directory", label: "A directory of verified waste management partners" },
  { value: "guidance", label: "Step-by-step guidance and resources" },
  { value: "networking", label: "Networking with other sustainable businesses" },
  { value: "funding", label: "Information on grants or funding" },
  { value: "training", label: "Employee training materials" },
  { value: "other", label: "Something else" },
];

export const STEP_RECOMMENDATIONS = {
  recycling: [
    {
      title: "Optimize your recycling stream",
      description: "Connect with verified recyclers in the directory to make sure your materials are sorted and processed correctly.",
    },
    {
      title: "Track your diversion rate",
      description: "Use a waste audit to see how much you're actually diverting from landfill and where you can improve.",
    },
  ],
  composting: [
    {
      title: "Scale up organic waste collection",
      description: "Browse composting partners who can handle larger volumes as your program grows.",
    },
    {
      title: "Reduce contamination",
      description: "Train staff on what belongs in the compost stream to keep pickup costs down.",
    },
  ],
  energy: [
    {
      title: "Get an energy audit",
      description: "Identify the highest-impact upgrades for your facility before investing in new equipment.",
    },
    {
      title: "Explore incentive programs",
      description: "Arizona utilities offer rebates for efficiency upgrades — check what your business qualifies for.",
    },
  ],
  sourcing: [
    {
      title: "Vet your supply chain",
      description: "Look for verified partners with transparent sourcing practices in the resource directory.",
    },
    {
      title: "Set sourcing benchmarks",
      description: "Define what 'sustainable' means for your purchasing decisions and track progress over time.",
    },
  ],
  waste_audit: [
    {
      title: "Turn your audit into a plan",
      description: "Use your waste audit results to prioritize the highest-impact changes first.",
    },
    {
      title: "Find the right partners",
      description: "Match your waste streams to verified haulers and recyclers who handle your specific materials.",
    },
  ],
  other: [
    {
      title: "Start with a waste audit",
      description: "Understanding what you're throwing away is the fastest way to find your next sustainability win.",
    },
    {
      title: "Browse the resource directory",
      description: "Explore verified waste management partners across Arizona to find the right fit for your business.",
    },
  ],
};

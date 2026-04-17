export type NavigationItem = {
  href: string;
  label: string;
  match: string[];
  children?: {
    href: string;
    label: string;
  }[];
};

export type SidebarLink = {
  href: string;
  label: string;
};

export type FocusBlock = {
  title: string;
  summary: string;
};

export type FeatureCard = {
  title: string;
  summary: string;
  href: string;
  imageSrc: string;
};

export type DetailBlock = {
  id: string;
  title: string;
  summary: string;
  details: string[];
};

export type ThemeBlock = {
  id: string;
  title: string;
  summary: string;
  examples: string[];
};

export type InsightLink = {
  title: string;
  href: string;
  label: string;
  summary: string;
};

export const company = {
  name: "Vermilion Gate",
  legalName: "Vermilion Gate Pte. Ltd.",
  description:
    "Founder-led advisory platform focused on strategic transactions, capital alignment, capital allocation strategy, and special situations requiring structural judgment.",
  shortDescription:
    "Singapore-based founder-led advisory platform for strategic transactions, capital alignment, capital allocation strategy, and special situations.",
  email: "info@vermiliongate.com",
  phone: "+65 6750 4641",
  addressLines: [
    "39 Robinson Road",
    "#11-01 Robinson Point",
    "Singapore 068911",
  ],
  linkedIn: "https://sg.linkedin.com/company/vermilion-gate",
  founderLinkedIn: "https://www.linkedin.com/in/cgloo",
  substack: "https://substack.com/@chengguanloo",
};

export const primaryNavigation: NavigationItem[] = [
  {
    href: "/about-us/overview",
    label: "About Us",
    match: ["/about-us/overview"],
    children: [
      {
        href: "/about-us/overview",
        label: "Overview",
      },
      {
        href: "/about-us/overview#founder",
        label: "Founder",
      },
      {
        href: "/about-us/overview#focus",
        label: "Current Focus",
      },
    ],
  },
  {
    href: "/our-business/overview",
    label: "Our Business",
    match: ["/our-business/overview", "/our-business/illustrative-themes"],
    children: [
      {
        href: "/our-business/overview",
        label: "Overview",
      },
      {
        href: "/our-business/overview#strategic-transactions",
        label: "Strategic Transactions",
      },
      {
        href: "/our-business/overview#capital-alignment",
        label: "Capital Alignment",
      },
      {
        href: "/our-business/overview#capital-allocation-strategy",
        label: "Capital Allocation Strategy",
      },
      {
        href: "/our-business/illustrative-themes",
        label: "Illustrative Themes",
      },
    ],
  },
  {
    href: "/insights",
    label: "Insights",
    match: ["/insights"],
  },
  {
    href: "/contact-us/our-office",
    label: "Contact Us",
    match: ["/contact-us"],
  },
];

export const aboutSidebar: SidebarLink[] = [
  { href: "#overview", label: "Overview" },
  { href: "#founder", label: "Founder" },
  { href: "#focus", label: "Current focus" },
];

export const businessSidebar: SidebarLink[] = [
  { href: "#strategic-transactions", label: "Strategic transactions" },
  { href: "#capital-alignment", label: "Capital alignment" },
  { href: "#capital-allocation-strategy", label: "Capital allocation strategy" },
  { href: "#special-situations-and-strategic-realignment", label: "Special situations" },
];

export const themesSidebar: SidebarLink[] = [
  { href: "#capital-misalignment", label: "Capital misalignment" },
  { href: "#listed-company-realignment", label: "Listed company realignment" },
  {
    href: "#cross-border-ownership-and-capital-transitions",
    label: "Cross-border transitions",
  },
  { href: "#special-situations", label: "Special situations" },
];

export const homeFocusBlocks: FocusBlock[] = [
  {
    title: "Strategic transactions",
    summary:
      "Mandates where structure matters as much as price, and where ownership, control, or strategic fit needs judgment before process begins.",
  },
  {
    title: "Capital alignment",
    summary:
      "Situations involving trapped, misapplied, or mismatched capital across shareholders, assets, or listed wrappers.",
  },
  {
    title: "Capital allocation strategy",
    summary:
      "Principal-side perspective on where capital should move, where it should wait, and what must be true before it is committed.",
  },
  {
    title: "Special situations and strategic realignment",
    summary:
      "Assignments where something is stuck and requires a structural reset in ownership, balance sheet, or strategic direction.",
  },
];

export const homeFeatureCards: FeatureCard[] = [
  {
    title: "Strategic Transactions",
    summary:
      "We advise on strategic transactions where structure, counterparties, and ownership logic matter as much as headline price.",
    href: "/our-business/overview#strategic-transactions",
    imageSrc: "/assets/feature-card-01.jpg",
  },
  {
    title: "Capital Alignment",
    summary:
      "We work where capital is trapped, misapplied, or no longer aligned with the strategic reality of the business.",
    href: "/our-business/overview#capital-alignment",
    imageSrc: "/assets/feature-card-02.jpg",
  },
  {
    title: "Capital Allocation Strategy",
    summary:
      "We bring an allocator’s lens to where capital should move, where it should wait, and what should be restructured first.",
    href: "/our-business/overview#capital-allocation-strategy",
    imageSrc: "/assets/feature-card-03.jpg",
  },
  {
    title: "Special Situations and Strategic Realignment",
    summary:
      "We focus on situations that are stuck and require a structural reset before capital or process can add useful momentum.",
    href: "/our-business/overview#special-situations-and-strategic-realignment",
    imageSrc: "/assets/feature-card-04.jpg",
  },
];

export const howWeWork: FocusBlock[] = [
  {
    title: "Selective advisory mandates",
    summary:
      "The platform is mandate-led and intentionally selective. Fit matters more than volume.",
  },
  {
    title: "Judgment before process",
    summary:
      "The first task is usually not launching a formal process, but understanding what is actually misaligned.",
  },
  {
    title: "Structure before capital",
    summary:
      "More capital is not always the answer. Often the structure, wrapper, or ownership logic needs to change first.",
  },
  {
    title: "Clarity before action",
    summary:
      "The goal is to create a cleaner decision before counterparties, documents, or capital commitments start to compound confusion.",
  },
];

export const whatWeAreNot: FocusBlock[] = [
  {
    title: "Not a broker",
    summary:
      "The work is not built around pushing an asset or a process to market.",
  },
  {
    title: "Not a general corporate finance shop",
    summary:
      "The platform is designed for specific, higher-judgment situations rather than broad execution volume.",
  },
  {
    title: "Not a broad project-finance adviser",
    summary:
      "The focus is structural judgment, capital fit, and strategic realignment, not generic financing coverage.",
  },
];

export const aboutNarrative = [
  "Vermilion Gate is a Singapore-based advisory platform led by Loo Cheng Guan. It was built for situations where something important no longer fits: capital structure, listed wrapper, ownership alignment, or strategic direction.",
  "The platform is useful when the problem is not lack of opportunity, but lack of fit. That requires early judgment before the wrong process is launched or premature capital is brought in to solve the wrong issue.",
  "The perspective is shaped by balance sheet discipline and an allocator's lens on risk, optionality, and capital prioritisation.",
];

export const founder = {
  name: "Loo Cheng Guan",
  title: "Founder",
  summary:
    "Loo Cheng Guan leads Vermilion Gate as a founder-led advisory platform focused on strategic transactions, capital alignment, cross-border ownership transitions, and special situations.",
  quote:
    "Not every situation needs more capital. Some need a different structure.",
};

export const founderExperience: FocusBlock[] = [
  {
    title: "Fund management",
    summary:
      "Experience shaped by principal-side capital judgment, portfolio thinking, and capital prioritisation.",
  },
  {
    title: "Private equity",
    summary:
      "Relevant to ownership transitions, control questions, and value creation under real capital constraints.",
  },
  {
    title: "M&A",
    summary:
      "Useful where transaction structure, counterparty fit, and negotiation logic matter as much as valuation.",
  },
  {
    title: "Corporate finance",
    summary:
      "Grounded in financing logic, strategic alternatives, and the consequences of capital structure choices.",
  },
];

export const founderFocusAreas: FocusBlock[] = [
  {
    title: "Strategic transactions",
    summary:
      "Assignments where ownership, control, and structure are central to the outcome.",
  },
  {
    title: "Capital alignment",
    summary:
      "Situations where capital is present but attached to the wrong strategy, wrapper, or incentive structure.",
  },
  {
    title: "Cross-border ownership transitions",
    summary:
      "Transitions that require local context and clean alignment between incoming capital and existing operators.",
  },
  {
    title: "Special situations",
    summary:
      "Mandates where strategic direction, ownership logic, or market positioning needs to be reset before progress can resume.",
  },
];

export const whatWeDoSections: DetailBlock[] = [
  {
    id: "strategic-transactions",
    title: "Strategic transactions",
    summary:
      "Strategic transactions where structure matters as much as price.",
    details: [
      "Ownership, control, or wrapper questions that need to be solved before process design.",
      "Counterparty or capital-provider fit that matters as much as valuation.",
      "Situations where premature execution would make the structure worse rather than better.",
    ],
  },
  {
    id: "capital-alignment",
    title: "Capital alignment",
    summary:
      "Capital that is trapped, misapplied, or mismatched to the business it is meant to support.",
    details: [
      "Balance sheet and shareholder structures no longer matching operating reality.",
      "Listed or holding-company structures creating friction rather than optionality.",
      "Need for a cleaner fit between capital, ownership expectations, and strategic intent.",
    ],
  },
  {
    id: "capital-allocation-strategy",
    title: "Capital allocation strategy",
    summary:
      "A principal-side perspective on where capital should or should not move.",
    details: [
      "Deciding what deserves capital, what should wait, and what should be restructured first.",
      "Testing whether capital is being used to solve a structural problem or to avoid one.",
      "Prioritising optionality, downside control, and strategic fit before deployment.",
    ],
  },
  {
    id: "special-situations-and-strategic-realignment",
    title: "Special situations and strategic realignment",
    summary:
      "Situations where something is stuck and requires a structural reset.",
    details: [
      "Businesses or assets caught between ownership histories and future strategy.",
      "Structures that no longer support the company's market positioning or decision-making.",
      "Assignments where clarity, not speed, is the first requirement.",
    ],
  },
];

export const illustrativeThemes: ThemeBlock[] = [
  {
    id: "capital-misalignment",
    title: "Capital misalignment",
    summary:
      "The issue is not absence of capital, but capital sitting against the wrong asset, wrapper, or objective.",
    examples: [
      "Capital allocated to a structure that no longer reflects the operating business.",
      "Shareholder expectations diverging from what the balance sheet can support.",
      "Financing logic persisting after the strategic rationale has changed.",
    ],
  },
  {
    id: "listed-company-realignment",
    title: "Listed company realignment",
    summary:
      "A listed entity or market wrapper no longer serving strategic intent, capital formation, or control logic.",
    examples: [
      "Public market status creating friction rather than optionality.",
      "A listed vehicle requiring a rethink of ownership path, control, or capital access.",
      "Need to reassess whether the wrapper still fits the underlying business reality.",
    ],
  },
  {
    id: "cross-border-ownership-and-capital-transitions",
    title: "Cross-border ownership and capital transitions",
    summary:
      "Ownership transitions across borders where local context and capital-provider expectations need cleaner alignment.",
    examples: [
      "Incoming capital and local operators carrying different assumptions about control.",
      "Cross-border transitions where structure must be reset before capital can move with confidence.",
      "Ownership handovers complicated by mismatched timing, incentives, or market positioning.",
    ],
  },
  {
    id: "special-situations",
    title: "Special situations",
    summary:
      "Situations where the narrative is no longer enough and structural judgment is required to restore direction.",
    examples: [
      "Assets or corporate structures stuck between historical decisions and current needs.",
      "Strategic resets after capital dead ends, governance tension, or stalled transactions.",
      "Assignments where action has stopped because incentives no longer line up.",
    ],
  },
];

export const insightsLinks: InsightLink[] = [
  {
    title: "Vermilion Gate on LinkedIn",
    href: company.linkedIn,
    label: "Short-form field notes",
    summary:
      "Company updates and short-form observations on capital alignment, structural tension, and situations in motion.",
  },
  {
    title: "Cheng Guan Loo on LinkedIn",
    href: company.founderLinkedIn,
    label: "Founder perspective",
    summary:
      "Direct perspective from Cheng Guan on judgment, capital allocation, and current market conversations.",
  },
  {
    title: "Substack",
    href: company.substack,
    label: "Long-form essays",
    summary:
      "Long-form essays on capital allocation, structural tension, special situations, and strategic realignment.",
  },
];

export const officeNotes = [
  "Useful where the first need is clarity, not process.",
  "A short note describing where capital, ownership, structure, or strategic direction no longer fit cleanly is enough to start.",
  "The platform remains founder-led from first conversation through mandate fit.",
];

export const frequentlyAskedQuestions = [
  {
    question: "What kind of situation is a good fit for a first conversation?",
    answer:
      "A good fit is usually a situation where capital, ownership, structure, or strategic direction no longer fit cleanly and the first need is judgment rather than a standard process.",
  },
  {
    question: "Do you publish a transaction list or tombstones?",
    answer:
      "No. The site now uses illustrative themes instead of legacy transaction references because the work is better explained through structure and situation type.",
  },
  {
    question: "Is the work sector-defined?",
    answer:
      "No. The platform is situation-defined rather than sector-defined. The common thread is structural tension and the need for cleaner alignment before capital is committed.",
  },
];

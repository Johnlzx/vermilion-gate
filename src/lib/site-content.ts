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
  href?: string;
  title: string;
  summary: string;
};

export type DetailBlock = {
  id: string;
  title: string;
  summary: string;
  details: string[];
};

export type SituationBlock = {
  id: string;
  title: string;
  setting: string;
  constraint: string;
  work: string;
  result: string;
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
  phone: "+65 9799 1028",
  addressLines: [
    "30 Cecil Road",
    "#28-08 Prudential Tower",
    "Singapore 049712",
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
    match: ["/our-business/overview", "/our-business/selected-situations"],
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
        href: "/our-business/overview#special-situations-and-strategic-realignment",
        label: "Special Situations",
      },
      {
        href: "/our-business/selected-situations",
        label: "Selected Situations",
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
  { href: "#selected-situations", label: "Selected situations" },
];

export const situationsSidebar: SidebarLink[] = [
  { href: "#designing-the-business", label: "Designing the business" },
  { href: "#separating-project-risk", label: "Separating project risk" },
  { href: "#fundraising-around-evidence", label: "Fundraising around evidence" },
];

export const homeFocusBlocks: FocusBlock[] = [
  {
    title: "Strategic Transactions",
    href: "/our-business/overview#strategic-transactions",
    summary: "Transactions where structure matters as much as price.",
  },
  {
    title: "Capital Alignment",
    href: "/our-business/overview#capital-alignment",
    summary:
      "Situations where capital is trapped, misapplied, or no longer aligned with business reality.",
  },
  {
    title: "Capital Allocation Strategy",
    href: "/our-business/overview#capital-allocation-strategy",
    summary:
      "A principal-side perspective on where capital should move, where it should wait, and what should be reset first.",
  },
  {
    title: "Special Situations",
    href: "/our-business/overview#special-situations-and-strategic-realignment",
    summary: "Situations where progress is blocked by structural tension.",
  },
];

export const homeWhatThisMeans = {
  heading: "What This Means",
  copy: [
    "We focus on situations where structure matters more than story.",
    "The work is situation-defined, not sector-defined.",
    "The first need is usually clarity, not process.",
    "We only take on mandates where judgment, structural fit, and capital discipline materially shape the outcome.",
  ],
};

export const homeFounderLed = {
  heading: "Founder-led",
  copy: "Vermilion Gate is led by Cheng-Guan Loo, CEO of RidgeField Capital and a board member of CastleReach. His work through Vermilion Gate spans more than a decade and focuses on situations where something important no longer fits — in capital structure, ownership, market positioning, or strategic direction.",
};

export const homeInsights = {
  heading: "Insights",
  copy: "The website sets the lane. Our ongoing thinking sits in our posts.",
  links: [
    {
      label: "Follow on LinkedIn",
      href: company.linkedIn,
      description: "Short-form field notes and real-time signals.",
    },
    {
      label: "Read on Substack",
      href: company.substack,
      description:
        "Longer-form essays on capital, structure, and special situations.",
    },
  ],
};

export const homeWhatWeAreNot = {
  heading: "What We Are Not",
  title: "The platform is deliberately narrower than a generic advisory offering.",
  copy: "The work is not built around broad coverage, process volume, or default corporate-finance positioning. It is designed for specific situations that require structural judgment first.",
};

export const howWeWork: FocusBlock[] = [
  {
    title: "Selective advisory mandates",
    summary: "Fit matters more than volume.",
  },
  {
    title: "Judgment before process",
    summary: "Understand what is actually misaligned first.",
  },
  {
    title: "Structure before capital",
    summary:
      "The wrapper, ownership, or balance-sheet logic often needs to change first.",
  },
  {
    title: "Clarity before action",
    summary:
      "A cleaner decision before counterparties, documents, or capital compound the confusion.",
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

export const businessSelectedSituations = {
  kicker: "The work in practice",
  heading: "Selected situations",
  copy: "Three anonymised engagements show how Vermilion Gate's judgment changed an operating model, a project-risk structure, and a fundraising strategy before process or capital was allowed to run ahead of the evidence.",
};

export const selectedSituations: SituationBlock[] = [
  {
    id: "designing-the-business",
    title: "Designing the business before combining the companies",
    setting:
      "Two established businesses in different Asian markets were considering a combination to create a regional services platform.",
    constraint:
      "The strategic ambition had advanced ahead of the post-combination operating model.",
    work:
      "Vermilion Gate reviewed the business plans and financial assumptions, helped define how the combined platform would develop in stages, and required a consolidated model before the proposed ownership exchange and fundraising structure could be properly assessed.",
    result:
      "The discussion moved from a headline merger towards a phased regional-platform strategy supported by clearer operating priorities, financial requirements and diligence questions. The transaction process advanced, although the combination was not ultimately completed.",
  },
  {
    id: "separating-project-risk",
    title: "Separating technology, delivery and operating risk before project financing",
    setting:
      "A sponsor and several technical and operating partners were developing a capital-intensive production project.",
    constraint:
      "Technology ownership, delivery responsibility, operational performance and capital exposure were insufficiently separated.",
    work:
      "Vermilion Gate developed the decision and financial framework, proposed the project and funding structure, separated construction responsibilities from operating obligations, and introduced independent technical validation. Vendor economics were linked to project gates, while operating obligations were tied to performance measures and step-in rights.",
    result:
      "The project was reframed as a phased and contractually accountable structure, with clearer ownership, risk allocation and conditions for financial close. It was subsequently paused before capital was committed.",
  },
  {
    id: "fundraising-around-evidence",
    title: "Restructuring a cross-border fundraising strategy around evidence",
    setting:
      "An industrial-technology company operating across several jurisdictions was preparing an institutional growth round after completing an earlier validation financing.",
    constraint:
      "The fundraising narrative had to reconcile its holding structure, operating footprint, intellectual property, shareholder profile and valuation expectations.",
    work:
      "Vermilion Gate reframed the round around commercial proof and defined milestones, challenged the valuation and funding assumptions, prepared the company for investor diligence, and sequenced engagement between financial and strategic investors.",
    result:
      "The proposed round was resized and the process became more disciplined. Diligence advanced around customer validation, ownership, intellectual property, financial performance and operating substance. The fundraising remained in progress rather than being presented as a completed raise.",
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
      "No. The site uses selected, anonymised situations instead of legacy transaction references because the work is better explained through the initial constraint, the work performed, and the resulting decision or structural change.",
  },
  {
    question: "Is the work sector-defined?",
    answer:
      "No. The platform is situation-defined rather than sector-defined. The common thread is structural tension and the need for cleaner alignment before capital is committed.",
  },
];

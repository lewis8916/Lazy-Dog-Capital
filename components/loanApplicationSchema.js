// Field definitions mirroring Loan_Application_Fillable.pdf (3 pages, 133 fields).
// `pdf` holds the matching PDF field name so submissions can be poured back into
// the original form later. Radio groups collapse the PDF's paired checkboxes
// (e.g. p_purch / p_refi / p_other) into one value.

const guarantorFields = (n, required) => [
  {
    name: `g${n}_name`,
    label: "Full legal name",
    required,
    col: 2,
    pdf: `g${n}_name`,
  },
  { name: `g${n}_pct`, label: "Ownership %", type: "number", required, pdf: `g${n}_pct` },
  { name: `g${n}_dob`, label: "Date of birth", type: "date", required, pdf: `g${n}_dob` },
  { name: `g${n}_addr`, label: "Home address", required, col: 2, pdf: `g${n}_addr` },
  { name: `g${n}_phone`, label: "Phone", type: "tel", required, pdf: `g${n}_phone` },
  { name: `g${n}_email`, label: "Email", type: "email", required, pdf: `g${n}_email` },
  {
    name: `g${n}_yrs`,
    label: "Years investing in real estate",
    type: "number",
    required,
    pdf: `g${n}_yrs`,
  },
  {
    name: `g${n}_flips`,
    label: "Flips completed",
    type: "number",
    required,
    pdf: `g${n}_flips`,
  },
];

export const DECLARATIONS = [
  { name: "dq1", q: "Have you or any principal filed bankruptcy in the last seven years?" },
  {
    name: "dq2",
    q: "Have you or any principal had a property foreclosed on or given a deed in lieu?",
  },
  { name: "dq3", q: "Are there any outstanding judgments against you or any principal?" },
  { name: "dq4", q: "Are you or any principal a party to any lawsuit?" },
  { name: "dq5", q: "Are you or any principal delinquent on any federal debt?" },
  {
    name: "dq6",
    q: "Has any lender declined or withdrawn a loan to you in the last 24 months?",
  },
  {
    name: "dq7",
    q: "Will the Property be occupied by you or any principal as a residence?",
    disqualifying: true,
  },
  {
    name: "dq8",
    q: "Will the Property be claimed as a homestead by you or any principal?",
    disqualifying: true,
  },
];

export const CERTIFICATIONS = [
  { name: "a1", text: "The information in this application is true, complete, and accurate." },
  {
    name: "a2",
    text: "I authorize Lazy Dog Capital LLC to verify the information in this application.",
  },
  {
    name: "a3",
    text: "The loan requested is solely for business, commercial, or investment purposes, and not for personal, family, or household purposes.",
  },
  {
    name: "a4",
    text: "I understand this application is not a commitment to lend and that all terms are subject to underwriting.",
  },
  {
    name: "a5",
    text: "I will promptly notify Lazy Dog Capital in writing if any information in this application changes.",
  },
];

export const PROJECT_COLUMNS = [
  { key: "addr", label: "Property address", col: 2 },
  { key: "purchased", label: "Purchased", type: "month" },
  { key: "sold", label: "Sold", type: "month" },
  { key: "purchase_price", label: "Purchase $", money: true },
  { key: "sale_price", label: "Sale $", money: true },
];

export const MAX_PROJECT_ROWS = 6;

export const STEPS = [
  {
    id: "request",
    title: "Loan Request",
    blurb: "Start with what you need and who is borrowing.",
    sections: [
      {
        heading: "Loan Request",
        fields: [
          {
            name: "req_amount",
            label: "Loan amount requested",
            money: true,
            required: true,
            pdf: "req_amount",
          },
          {
            name: "req_close",
            label: "Desired closing date",
            type: "date",
            required: true,
            pdf: "req_close",
          },
          {
            name: "purpose",
            label: "Purpose",
            type: "radio",
            required: true,
            col: 2,
            options: [
              { value: "purchase", label: "Purchase + rehab", pdf: "p_purch" },
              { value: "refi", label: "Refinance + rehab", pdf: "p_refi" },
              { value: "other", label: "Other", pdf: "p_other", otherField: "p_other_txt" },
            ],
          },
        ],
      },
      {
        heading: "Borrowing Entity",
        note: "We lend to entities, not individuals. If your entity is not formed yet, tell us in the notes at the end.",
        fields: [
          { name: "e_name", label: "Entity name", required: true, col: 2, pdf: "e_name" },
          {
            name: "e_type",
            label: "Entity type",
            type: "select",
            required: true,
            options: ["LLC", "Series LLC", "Corporation", "Limited Partnership", "Other"],
            pdf: "e_type",
          },
          {
            name: "e_state",
            label: "State of formation",
            required: true,
            placeholder: "TX",
            pdf: "e_state",
          },
          { name: "e_formed", label: "Date formed", type: "date", pdf: "e_formed" },
          { name: "e_ein", label: "EIN", placeholder: "12-3456789", pdf: "e_ein" },
          { name: "e_phone", label: "Phone", type: "tel", required: true, pdf: "e_phone" },
          { name: "e_email", label: "Email", type: "email", required: true, pdf: "e_email" },
          { name: "e_addr", label: "Mailing address", required: true, col: 2, pdf: "e_addr" },
        ],
      },
    ],
  },
  {
    id: "principals",
    title: "Principals",
    blurb: "Everyone who owns part of the entity and will guarantee the loan.",
    sections: [
      {
        heading: "Principal / Guarantor 1",
        fields: guarantorFields(1, true),
      },
      {
        heading: "Principal / Guarantor 2",
        optional: true,
        fields: guarantorFields(2, false),
      },
      {
        heading: "Principal / Guarantor 3",
        optional: true,
        fields: guarantorFields(3, false),
      },
    ],
  },
  {
    id: "deal",
    title: "The Deal",
    blurb: "The property, the numbers, and who is on your team.",
    sections: [
      {
        heading: "Subject Property",
        fields: [
          { name: "pr_addr", label: "Property address", required: true, col: 2, pdf: "pr_addr" },
          { name: "pr_county", label: "County", required: true, pdf: "pr_county" },
          { name: "pr_year", label: "Year built", type: "number", pdf: "pr_year" },
          { name: "pr_beds", label: "Beds / baths", placeholder: "3 / 2", pdf: "pr_beds" },
          { name: "pr_sqft", label: "Square feet", type: "number", pdf: "pr_sqft" },
          {
            name: "occupancy",
            label: "Current occupancy",
            type: "radio",
            required: true,
            col: 2,
            options: [
              { value: "vacant", label: "Vacant", pdf: "occ_vac" },
              { value: "tenant", label: "Tenant occupied", pdf: "occ_ten" },
              { value: "seller", label: "Seller occupied", pdf: "occ_own" },
            ],
          },
        ],
      },
      {
        heading: "The Deal",
        fields: [
          {
            name: "d_price",
            label: "Purchase price",
            money: true,
            required: true,
            pdf: "d_price",
          },
          {
            name: "d_close",
            label: "Under contract? Closing date",
            type: "date",
            pdf: "d_close",
          },
          {
            name: "d_down",
            label: "Your down payment",
            hint: "10% of purchase price",
            money: true,
            required: true,
            pdf: "d_down",
          },
          {
            name: "d_rehab",
            label: "Estimated rehab budget",
            money: true,
            required: true,
            pdf: "d_rehab",
          },
          {
            name: "d_months",
            label: "Estimated months to complete",
            type: "number",
            required: true,
            pdf: "d_months",
          },
          {
            name: "d_resale",
            label: "Estimated resale value after repairs",
            money: true,
            required: true,
            pdf: "d_resale",
          },
          {
            name: "d_source",
            label: "Source of your down payment funds",
            required: true,
            col: 2,
            pdf: "d_source",
          },
          {
            name: "exit",
            label: "Exit strategy",
            type: "radio",
            required: true,
            col: 2,
            options: [
              { value: "sell", label: "Sell", pdf: "x_sell" },
              { value: "refi", label: "Refinance and hold", pdf: "x_refi" },
              { value: "other", label: "Other", pdf: "x_other", otherField: "x_other_txt" },
            ],
          },
        ],
      },
      {
        heading: "Financial Strength & Current Workload",
        fields: [
          {
            name: "fs_liquid",
            label: "Liquid assets available",
            money: true,
            required: true,
            pdf: "fs_liquid",
          },
          {
            name: "fs_reserves",
            label: "Cash reserves after closing",
            money: true,
            required: true,
            pdf: "fs_reserves",
          },
          {
            name: "fs_projects",
            label: "Projects currently in progress",
            type: "number",
            pdf: "fs_projects",
          },
          {
            name: "fs_debt",
            label: "Balance on other active loans",
            money: true,
            pdf: "fs_debt",
          },
        ],
      },
      {
        heading: "Your Team",
        optional: true,
        fields: [
          { name: "t_title", label: "Title company", pdf: "t_title" },
          { name: "t_escrow", label: "Escrow officer", pdf: "t_escrow" },
          { name: "t_ins", label: "Insurance agent", pdf: "t_ins" },
          { name: "t_ins_ph", label: "Phone", type: "tel", pdf: "t_ins_ph" },
          { name: "t_agent", label: "Real estate agent", pdf: "t_agent" },
          { name: "t_agent_ph", label: "Phone", type: "tel", pdf: "t_agent_ph" },
          { name: "t_gc", label: "General contractor", pdf: "t_gc" },
          { name: "t_gc_ph", label: "Phone", type: "tel", pdf: "t_gc_ph" },
        ],
      },
    ],
  },
  {
    id: "declarations",
    title: "Declarations",
    blurb: "Required disclosures, your track record, and authorization to proceed.",
    sections: [],
  },
];

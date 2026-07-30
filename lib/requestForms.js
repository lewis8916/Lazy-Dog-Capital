// Schemas for the borrower request forms under /resources. Shared by the form
// component and the API routes so labels, required fields, and the email all
// stay in step.

export const DRAW_REQUEST = {
  id: "draw-request",
  endpoint: "/api/draw-request",
  title: "Draw Request",
  submitLabel: "Submit Draw Request",
  emailTitle: "New Draw Request",
  successTitle: "Draw request received.",
  successBody:
    "We'll schedule the inspection and get back to you. Draws release within a couple of days of the work being verified.",
  note: "Email photos of the completed work and any paid invoices to us after you submit — they speed the inspection up.",
  sections: [
    {
      heading: "The Loan",
      fields: [
        { name: "entity", label: "Borrowing entity", required: true, col: 2 },
        { name: "address", label: "Property address", required: true, col: 2 },
        { name: "loan_number", label: "Loan number", placeholder: "If you have it" },
        {
          name: "draw_number",
          label: "Draw number",
          type: "select",
          required: true,
          options: ["1", "2", "3", "4", "5"],
        },
      ],
    },
    {
      heading: "The Request",
      fields: [
        {
          name: "amount",
          label: "Amount requested",
          money: true,
          required: true,
        },
        {
          name: "percent_complete",
          label: "Overall % complete",
          type: "number",
          required: true,
          placeholder: "45",
        },
        {
          name: "work_completed",
          label: "Work completed since the last draw",
          type: "textarea",
          required: true,
          col: 2,
          placeholder:
            "Framing, rough-in plumbing and electrical, windows installed…",
        },
        {
          name: "remaining_work",
          label: "What's left after this draw",
          type: "textarea",
          col: 2,
          placeholder: "Drywall, paint, flooring, fixtures, final grade…",
        },
      ],
    },
    {
      heading: "Inspection Access",
      fields: [
        {
          name: "access",
          label: "How does the inspector get in?",
          required: true,
          col: 2,
          placeholder: "Lockbox on the front door, or call the GC — 214-555-0100",
        },
        {
          name: "available_from",
          label: "Available for inspection from",
          type: "date",
          required: true,
        },
        { name: "gc_name", label: "General contractor", placeholder: "If applicable" },
      ],
    },
    {
      heading: "Who To Contact",
      fields: [
        { name: "name", label: "Your name", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "email", label: "Email", type: "email", required: true, col: 2 },
      ],
    },
  ],
  certifications: [
    "The work described above is complete and was performed on the property listed.",
    "All contractors and suppliers for this portion of the work have been paid, or will be paid from this draw.",
    "The information in this request is true and accurate to the best of my knowledge.",
  ],
  signature: true,
};

export const PAYOFF_REQUEST = {
  id: "payoff-request",
  endpoint: "/api/payoff-request",
  title: "Payoff Request",
  submitLabel: "Request Payoff Statement",
  emailTitle: "New Payoff Request",
  successTitle: "Payoff request received.",
  successBody:
    "We'll prepare the statement and send it to the email and title company below. If your closing date moves, let us know — payoff figures are good through a specific date.",
  note: "Payoff figures are quoted good through a specific date. If closing slips past it, request an updated statement.",
  sections: [
    {
      heading: "The Loan",
      fields: [
        { name: "entity", label: "Borrowing entity", required: true, col: 2 },
        { name: "address", label: "Property address", required: true, col: 2 },
        { name: "loan_number", label: "Loan number", placeholder: "If you have it" },
        {
          name: "reason",
          label: "Reason for payoff",
          type: "select",
          required: true,
          options: ["Sale", "Refinance", "Paying off with own funds", "Other"],
        },
      ],
    },
    {
      heading: "The Closing",
      fields: [
        {
          name: "payoff_date",
          label: "Good-through date",
          hint: "The date the figures need to be valid through",
          type: "date",
          required: true,
        },
        {
          name: "closing_date",
          label: "Estimated closing date",
          type: "date",
          required: true,
        },
        {
          name: "sale_price",
          label: "Sale or refinance amount",
          money: true,
          placeholder: "465,000",
        },
        { name: "buyer", label: "Buyer or new lender", placeholder: "If known" },
      ],
    },
    {
      heading: "Title / Closing Agent",
      fields: [
        { name: "title_company", label: "Title company", required: true, col: 2 },
        { name: "escrow_officer", label: "Escrow officer", required: true },
        { name: "title_phone", label: "Their phone", type: "tel", required: true },
        {
          name: "title_email",
          label: "Where to send the statement",
          type: "email",
          required: true,
          col: 2,
          hint: "The escrow officer's email",
        },
      ],
    },
    {
      heading: "Who To Contact",
      fields: [
        { name: "name", label: "Your name", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "email", label: "Your email", type: "email", required: true, col: 2 },
      ],
    },
  ],
  certifications: [
    "I am authorized to request a payoff statement on behalf of the borrowing entity.",
    "I authorize Lazy Dog Capital to send payoff figures to the title company listed above.",
  ],
  signature: true,
};

export const FORM_SCHEMAS = {
  "draw-request": DRAW_REQUEST,
  "payoff-request": PAYOFF_REQUEST,
};

/** Flat list of every field in a schema. */
export const allFields = (schema) =>
  schema.sections.flatMap((s) => s.fields);

/** Server-side validation shared by the API routes. */
export function validateRequest(schema, data) {
  const missing = allFields(schema)
    .filter((f) => f.required)
    .filter((f) => !String(data?.[f.name] ?? "").trim())
    .map((f) => f.name);

  if (missing.length) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  const emails = allFields(schema).filter((f) => f.type === "email");
  for (const f of emails) {
    if (!/^\S+@\S+\.\S+$/.test(String(data[f.name] || ""))) {
      return `"${f.label}" must be a valid email address.`;
    }
  }

  if (schema.certifications?.length) {
    const allAccepted = schema.certifications.every(
      (_, i) => data[`cert_${i}`] === true
    );
    if (!allAccepted) return "All certifications must be accepted.";
  }

  if (schema.signature) {
    if (!String(data.signature || "").trim()) return "A signature is required.";
    if (!String(data.signature_date || "").trim()) return "A signature date is required.";
  }

  return null;
}

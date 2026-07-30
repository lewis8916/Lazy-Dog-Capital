// Schemas for the borrower request forms under /resources. Shared by the form
// component and the API routes so labels, required fields, and the email all
// stay in step.

// Mirrors Construction_Draw_Request_Form_Fillable.pdf. The inspector and
// Lazy Dog Use Only blocks on page 2 of the PDF are deliberately absent — those
// are filled in after the borrower submits.
//
// The PDF's routing and account number fields are also absent: this form is
// delivered by email, and bank credentials should not travel that way. Bank
// name and name on account are kept so we can confirm the account already on
// file matches.
export const DRAW_REQUEST = {
  id: "draw-request",
  endpoint: "/api/draw-request",
  title: "Draw Request",
  emailTitle: "New Draw Request",
  successTitle: "Draw request received.",
  successBody:
    "We'll schedule the inspection. Funds release only after the completed work is inspected and verified.",
  certifications: [
    "The work covered by this request is complete and in place.",
    "All contractors and suppliers from prior draws are paid, and no lien has been filed or threatened.",
    "The loan is not in default and property insurance is in force with Lazy Dog Capital as loss payee.",
  ],
  attachments: [
    "Photos of the completed work",
    "Invoices or receipts for this request",
    "Bank statement showing the funds from your last draw were paid out to your contractors and suppliers",
  ],
  reimbursementMethods: ["Wire", "ACH", "Check"],
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


/** Flat list of every field in a schema. */
export const allFields = (schema) =>
  (schema.sections || []).flatMap((s) => s.fields);

const money = (v) => Number(String(v ?? "").replace(/[^\d.]/g, "")) || 0;

/** Draw balances, derived so the borrower cannot fat-finger the arithmetic. */
export function computeDraw(d) {
  const holdback = money(d.fr_holdback);
  const previous = money(d.fr_prev);
  const thisDraw = money(d.fr_this);
  const fee = money(d.nd_fee);

  const available = holdback - previous;
  const after = available - thisDraw;

  const items = (d.items || []).filter((r) =>
    Object.values(r).some((v) => String(v ?? "").trim())
  );
  const itemsTotal = items.reduce((sum, r) => sum + money(r.amt), 0);

  return {
    holdback,
    previous,
    thisDraw,
    fee,
    available,
    after,
    net: thisDraw - fee,
    items,
    itemsTotal,
    // The line items should account for what is being drawn.
    itemsMatch: Math.abs(itemsTotal - thisDraw) < 1,
    overAvailable: thisDraw > available && available > 0,
  };
}

const DRAW_REQUIRED = [
  ["borrower", "Borrower"],
  ["property", "Property address"],
  ["draw_no", "Draw number"],
  ["draw_date", "Date"],
  ["reimbursement", "Reimbursement method"],
  ["fr_holdback", "Total construction holdback"],
  ["fr_this", "This draw request"],
  ["contact1", "Contact 1"],
  ["phone1", "Contact 1 phone"],
  ["access", "Property access"],
  ["sig", "Signature"],
  ["sig_name", "Printed name"],
  ["sig_date", "Date signed"],
  ["email", "Email"],
];

/** Validation for the draw request, which has line items and its own shape. */
export function validateDraw(d) {
  const missing = DRAW_REQUIRED.filter(
    ([k]) => !String(d?.[k] ?? "").trim()
  ).map(([, label]) => label);

  if (missing.length) return `Missing required fields: ${missing.join(", ")}`;

  if (!/^\S+@\S+\.\S+$/.test(String(d.email || ""))) {
    return "Enter a valid email address.";
  }

  const { items } = computeDraw(d);
  if (!items.length) {
    return "Add at least one item to inspect.";
  }
  if (items.some((r) => !String(r.desc ?? "").trim() || !money(r.amt))) {
    return "Every item to inspect needs a description and an amount.";
  }

  if (!DRAW_REQUEST.certifications.every((_, i) => d[`cert_${i}`] === true)) {
    return "All certifications must be accepted.";
  }

  return null;
}

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

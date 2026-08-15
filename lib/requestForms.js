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
    "We'll schedule the inspection. Once we've seen the work in person, we reimburse you for what you've already paid out.",
  certifications: [
    "The work covered by this request is complete and in place.",
    "All contractors and suppliers from prior draws are paid, and no lien has been filed or threatened.",
    "The loan is not in default and property insurance is in force with Lazy Dog Capital as loss payee.",
  ],
  attachments: [
    "Photos of the completed work",
    "Invoices or receipts for this request",
    "Bank or credit card statement showing the money left your account to pay for this work",
  ],
  reimbursementMethods: ["Wire", "ACH", "Check"],
};

// Mirrors Proof_of_Funds_Request.pdf. Used to request a pre-qualification
// letter: proof of funds, track record, current workload, and lending
// history. Bank routing/account numbers are deliberately not collected —
// borrowers attach statements instead, same pattern as the draw request.
export const PRE_QUAL_REQUEST = {
  id: "pre-qual-request",
  endpoint: "/api/pre-qual-request",
  title: "Get Pre-Qual Letter",
  emailTitle: "New Pre-Qualification Request",
  successTitle: "Request received.",
  successBody:
    "We'll review your funds, track record, and lending history and get a pre-qualification letter back to you.",
  fundsHolders: 2,
  flipRows: 3,
  projectRows: 2,
  rentalRows: 3,
  lenderRows: 2,
  verificationOptions: [
    "Bank statements — most recent 2 months",
    "Brokerage / retirement statement",
    "HELOC or line of credit availability",
  ],
  whoDoesWork: [
    "Licensed general contractor",
    "Subcontractors I hire and manage",
    "I self-perform",
    "Combination",
  ],
  projectSizes: ["Under $50k", "$50k–$100k", "$100k–$200k", "Over $200k"],
  everQuestions: [
    { key: "q_extended", q: "Had a loan extended past its original maturity?" },
    { key: "q_late", q: "Been more than 30 days late on a real estate loan?" },
    { key: "q_overbudget", q: "Had a project run materially over budget?" },
    { key: "q_lien", q: "Had a mechanic's or materialman's lien filed on a project?" },
    {
      key: "q_unfinished",
      q: "Had a project you could not complete or had to sell unfinished?",
    },
  ],
  attachments: ["Bank / brokerage / HELOC statements"],
  certifications: [
    "The information on this form is true, complete, and accurate.",
    "I authorize Lazy Dog Capital LLC to verify it, including by contacting the financial institutions and lenders listed above.",
  ],
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

  return validateAttachments(d.attachments);
}

const PRE_QUAL_REQUIRED = [
  ["entity", "Borrowing entity"],
  ["principal", "Principal completing this form"],
  ["property", "Subject property"],
  ["down_payment", "Down payment funds"],
  ["name", "Your name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["signature", "Signature"],
  ["signature_name", "Printed name"],
  ["signature_date", "Date"],
];

/** Validation for the pre-qualification request. */
export function validatePreQual(d) {
  const missing = PRE_QUAL_REQUIRED.filter(
    ([k]) => !String(d?.[k] ?? "").trim()
  ).map(([, label]) => label);

  if (missing.length) return `Missing required fields: ${missing.join(", ")}`;

  if (!/^\S+@\S+\.\S+$/.test(String(d.email || ""))) {
    return "Enter a valid email address.";
  }

  if (!PRE_QUAL_REQUEST.certifications.every((_, i) => d[`cert_${i}`] === true)) {
    return "All certifications must be accepted.";
  }

  return validateAttachments(d.attachments);
}

// Mirrors the browser-side limits in FileUpload.jsx. A client can be bypassed,
// so the ceiling is enforced here too — Resend rejects anything over 40MB after
// base64, and base64 inflates by about a third.
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const ALLOWED_TYPES = /^(image\/(jpeg|png|gif|webp|heic|heif)|application\/pdf)$/;

export function validateAttachments(attachments) {
  if (!attachments) return null;
  if (!Array.isArray(attachments)) return "Attachments are malformed.";
  if (attachments.length > 40) return "Too many attachments — 40 maximum.";

  let total = 0;
  for (const a of attachments) {
    if (!a?.filename || typeof a.content !== "string") {
      return "An attachment is missing its name or contents.";
    }
    if (a.type && !ALLOWED_TYPES.test(a.type)) {
      return `${a.filename} is not an image or PDF.`;
    }
    // Base64 length maps back to roughly 3/4 as many raw bytes.
    total += Math.floor((a.content.length * 3) / 4);
  }

  if (total > MAX_UPLOAD_BYTES) {
    return `Attachments total ${Math.round(total / 1024 / 1024)}MB — the limit is ${MAX_UPLOAD_BYTES / 1024 / 1024}MB.`;
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

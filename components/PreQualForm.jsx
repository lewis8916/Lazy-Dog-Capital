"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Info, Loader2 } from "lucide-react";
import { PRE_QUAL_REQUEST } from "@/lib/requestForms";
import Honeypot from "@/components/Honeypot";
import { formatMoney } from "@/lib/dealMath";
import { submitForm } from "@/lib/submitForm";
import FileUpload, {
  MAX_TOTAL_BYTES,
  formatBytes,
  toBase64,
} from "@/components/FileUpload";

const emptyFund = () => ({ bank: "", balance: "", holder: "" });
const emptyFlip = () => ({ address: "", purchase: "", rehab: "", sold: "", held: "" });
const emptyProject = () => ({ address: "", purchase_date: "", pct_done: "" });
const emptyRental = () => ({ address: "", value: "", loan_balance: "", rent: "", personal: false });
const emptyLender = () => ({ lender: "", loans: "", active: "", contact: "" });

const initial = {
  entity: "",
  principal: "",
  property: "",
  down_payment: "",
  closing_costs: "",
  funds: Array.from({ length: PRE_QUAL_REQUEST.fundsHolders }, emptyFund),
  verify: {},
  verify_other: "",
  flips_36: "",
  flips_life: "",
  flips: Array.from({ length: PRE_QUAL_REQUEST.flipRows }, emptyFlip),
  projects: Array.from({ length: PRE_QUAL_REQUEST.projectRows }, emptyProject),
  rentals: Array.from({ length: PRE_QUAL_REQUEST.rentalRows }, emptyRental),
  work_who: {},
  primary_contractor: "",
  years_together: "",
  markets: "",
  project_size: "",
  similar_diff: "",
  lenders: Array.from({ length: PRE_QUAL_REQUEST.lenderRows }, emptyLender),
  ever: {},
  ever_explain: "",
  name: "",
  phone: "",
  email: "",
  signature: "",
  signature_name: "",
  signature_date: "",
};

export default function PreQualForm() {
  const [v, setV] = useState(initial);
  const [uploads, setUploads] = useState([]);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const set = (k, val) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };

  const setRow = (group, i, key, val) =>
    setV((s) => ({
      ...s,
      [group]: s[group].map((r, ri) => (ri === i ? { ...r, [key]: val } : r)),
    }));

  const toggle = (group, key) =>
    setV((s) => ({ ...s, [group]: { ...s[group], [key]: !s[group][key] } }));

  const validate = () => {
    const e = {};
    const need = {
      entity: "Required",
      principal: "Required",
      property: "Required",
      down_payment: "Required",
      name: "Required",
      phone: "Required",
      email: "Required",
      signature: "Required",
      signature_name: "Required",
      signature_date: "Required",
    };
    Object.entries(need).forEach(([k, msg]) => {
      if (!String(v[k] ?? "").trim()) e[k] = msg;
    });
    if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
    PRE_QUAL_REQUEST.certifications.forEach((_, i) => {
      if (!v[`cert_${i}`]) e[`cert_${i}`] = "Required";
    });
    const usedBytes = uploads.reduce((n, f) => n + f.size, 0);
    if (usedBytes > MAX_TOTAL_BYTES) {
      e.uploads = `Attachments total ${formatBytes(usedBytes)} — the limit is ${formatBytes(MAX_TOTAL_BYTES)}`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      document
        .querySelector("[data-prequal-top]")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setStatus("submitting");
    setServerError("");
    try {
      const attachments = [];
      for (const file of uploads) {
        attachments.push({
          filename: file.name,
          type: file.type,
          size: file.size,
          content: await toBase64(file),
        });
      }
      await submitForm(PRE_QUAL_REQUEST.endpoint, { ...v, attachments, ldc_hp: hp });
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(err.message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-bronze/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={44} className="text-bronze" />
        </div>
        <h2 className="display text-teal text-3xl sm:text-4xl mb-4">
          {PRE_QUAL_REQUEST.successTitle}
        </h2>
        <p className="text-teal/70 leading-relaxed mb-8">
          Thanks{v.name ? `, ${v.name.split(" ")[0]}` : ""}. {PRE_QUAL_REQUEST.successBody}
        </p>
        <Link href="/resources/forms" className="btn-primary">
          Back to resources <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" data-prequal-top>
      <div className="mb-6 flex items-start gap-4 p-5 rounded-2xl bg-bronze/10 border border-bronze/25">
        <Info size={20} className="text-bronze flex-shrink-0 mt-0.5" />
        <p className="text-teal/80 text-sm leading-relaxed">
          Fill this out for the borrowing entity and each principal. Attach
          your bank, brokerage, or HELOC statements below — statements must
          show the account holder&apos;s name, but you may black out account
          numbers except the last 4 digits.
        </p>
      </div>

      <div className="bg-cream rounded-3xl p-7 sm:p-9 shadow-xl border border-teal/5">
        <form onSubmit={submit} className="space-y-10">
          <Honeypot value={hp} onChange={setHp} />

          {/* Header */}
          <Section heading="Who This Is For">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Field label="Borrowing entity" required error={errors.entity}
                  value={v.entity} onChange={(x) => set("entity", x)} />
              </div>
              <Field label="Principal completing this form" required error={errors.principal}
                value={v.principal} onChange={(x) => set("principal", x)} />
              <Field label="Subject property" required error={errors.property}
                value={v.property} onChange={(x) => set("property", x)}
                placeholder="If known" />
            </div>
          </Section>

          {/* Part 1 — Proof of Funds */}
          <Section heading="Part 1 — Proof Of Funds">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Down payment funds" money required error={errors.down_payment}
                value={v.down_payment} onChange={(x) => set("down_payment", formatMoney(x))} />
              <Field label="Closing costs & fees" money value={v.closing_costs}
                onChange={(x) => set("closing_costs", formatMoney(x))} />
            </div>

            <div className="mt-6">
              <Label>Where are the funds held?</Label>
              <div className="space-y-3">
                {v.funds.map((row, i) => (
                  <div key={i}
                    className="grid grid-cols-2 sm:grid-cols-6 gap-3 p-4 rounded-2xl bg-cream-light border border-teal/10">
                    <div className="col-span-2 sm:col-span-3">
                      <MiniLabel>Bank / institution</MiniLabel>
                      <MiniInput value={row.bank} onChange={(x) => setRow("funds", i, "bank", x)} />
                    </div>
                    <div className="sm:col-span-1">
                      <MiniLabel>Balance</MiniLabel>
                      <MiniInput money value={row.balance}
                        onChange={(x) => setRow("funds", i, "balance", formatMoney(x))} />
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                      <MiniLabel>Account holder name</MiniLabel>
                      <MiniInput value={row.holder} onChange={(x) => setRow("funds", i, "holder", x)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Label>Attach verification — check what you&apos;re providing</Label>
              <div className="flex flex-wrap gap-3 mb-4">
                {PRE_QUAL_REQUEST.verificationOptions.map((opt) => (
                  <label key={opt}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-medium border cursor-pointer transition-colors ${
                      v.verify[opt]
                        ? "bg-teal border-teal text-cream"
                        : "border-teal/20 text-teal/70 hover:border-bronze hover:text-bronze"
                    }`}>
                    <input type="checkbox" checked={!!v.verify[opt]}
                      onChange={() => toggle("verify", opt)} className="hidden" />
                    {opt}
                  </label>
                ))}
              </div>
              <Field label="Other" value={v.verify_other} placeholder="Optional"
                onChange={(x) => set("verify_other", x)} />
            </div>

            <div className="mt-6">
              <FileUpload
                label="Statements"
                hint={`Images and PDFs, up to ${formatBytes(MAX_TOTAL_BYTES)} in total.`}
                files={uploads}
                error={errors.uploads}
                onChange={(next) => {
                  setUploads(next);
                  if (errors.uploads) setErrors((e) => ({ ...e, uploads: null }));
                }}
              />
            </div>
          </Section>

          {/* Part 2 — Completed Flips */}
          <Section heading="Part 2 — Completed Flips">
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <Field label="Number of completed flips — last 36 months" type="number"
                value={v.flips_36} onChange={(x) => set("flips_36", x)} />
              <Field label="Lifetime" type="number" value={v.flips_life}
                onChange={(x) => set("flips_life", x)} />
            </div>
            <div className="space-y-3">
              {v.flips.map((row, i) => (
                <div key={i} className="p-4 rounded-2xl bg-cream-light border border-teal/10">
                  <MiniLabel>Address {i + 1}</MiniLabel>
                  <MiniInput value={row.address} onChange={(x) => setRow("flips", i, "address", x)} />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    <div>
                      <MiniLabel>Purchase</MiniLabel>
                      <MiniInput money value={row.purchase}
                        onChange={(x) => setRow("flips", i, "purchase", formatMoney(x))} />
                    </div>
                    <div>
                      <MiniLabel>Rehab</MiniLabel>
                      <MiniInput money value={row.rehab}
                        onChange={(x) => setRow("flips", i, "rehab", formatMoney(x))} />
                    </div>
                    <div>
                      <MiniLabel>Sold</MiniLabel>
                      <MiniInput money value={row.sold}
                        onChange={(x) => setRow("flips", i, "sold", formatMoney(x))} />
                    </div>
                    <div>
                      <MiniLabel>Held (months)</MiniLabel>
                      <MiniInput value={row.held} onChange={(x) => setRow("flips", i, "held", x)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Part 3 — Current Projects */}
          <Section heading="Part 3 — Current Projects">
            <div className="space-y-3">
              {v.projects.map((row, i) => (
                <div key={i}
                  className="grid grid-cols-2 sm:grid-cols-6 gap-3 p-4 rounded-2xl bg-cream-light border border-teal/10">
                  <div className="col-span-2 sm:col-span-3">
                    <MiniLabel>Address {i + 1}</MiniLabel>
                    <MiniInput value={row.address}
                      onChange={(x) => setRow("projects", i, "address", x)} />
                  </div>
                  <div className="sm:col-span-2">
                    <MiniLabel>Purchase date</MiniLabel>
                    <MiniInput type="date" value={row.purchase_date}
                      onChange={(x) => setRow("projects", i, "purchase_date", x)} />
                  </div>
                  <div className="sm:col-span-1">
                    <MiniLabel>% done</MiniLabel>
                    <MiniInput value={row.pct_done}
                      onChange={(x) => setRow("projects", i, "pct_done", x)} placeholder="50" />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Part 4 — Rentals and Other Real Estate Held */}
          <Section heading="Part 4 — Rentals & Other Real Estate Held">
            <p className="text-teal/55 text-sm mb-5 leading-relaxed">
              Long-term holds, rentals, land, and your personal residence.
            </p>
            <div className="space-y-3">
              {v.rentals.map((row, i) => (
                <div key={i} className="p-4 rounded-2xl bg-cream-light border border-teal/10">
                  <MiniLabel>Address {i + 1}</MiniLabel>
                  <MiniInput value={row.address} onChange={(x) => setRow("rentals", i, "address", x)} />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 items-end">
                    <div>
                      <MiniLabel>Est. value</MiniLabel>
                      <MiniInput money value={row.value}
                        onChange={(x) => setRow("rentals", i, "value", formatMoney(x))} />
                    </div>
                    <div>
                      <MiniLabel>Loan balance</MiniLabel>
                      <MiniInput money value={row.loan_balance}
                        onChange={(x) => setRow("rentals", i, "loan_balance", formatMoney(x))} />
                    </div>
                    <div>
                      <MiniLabel>Monthly rent</MiniLabel>
                      <MiniInput money value={row.rent}
                        onChange={(x) => setRow("rentals", i, "rent", formatMoney(x))} />
                    </div>
                    <label className="flex items-center gap-2 pb-2.5 text-xs text-teal/70 cursor-pointer">
                      <input type="checkbox" checked={!!row.personal}
                        onChange={(e) => setRow("rentals", i, "personal", e.target.checked)}
                        className="w-4 h-4 accent-bronze" />
                      Personal residence
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Part 5 — Experience */}
          <Section heading="Part 5 — Experience">
            <Label>Who does the work?</Label>
            <div className="flex flex-wrap gap-3 mb-5">
              {PRE_QUAL_REQUEST.whoDoesWork.map((opt) => (
                <label key={opt}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold border cursor-pointer transition-colors ${
                    v.work_who[opt]
                      ? "bg-teal border-teal text-cream"
                      : "border-teal/20 text-teal/70 hover:border-bronze hover:text-bronze"
                  }`}>
                  <input type="checkbox" checked={!!v.work_who[opt]}
                    onChange={() => toggle("work_who", opt)} className="hidden" />
                  {opt}
                </label>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <Field label="Primary contractor, if you use one" value={v.primary_contractor}
                onChange={(x) => set("primary_contractor", x)} />
              <Field label="Years together" value={v.years_together}
                onChange={(x) => set("years_together", x)} />
            </div>
            <div className="mb-5">
              <Field label="Markets you work in" value={v.markets}
                onChange={(x) => set("markets", x)} placeholder="Dallas–Fort Worth" />
            </div>
            <div className="mb-5">
              <Label>Typical project size</Label>
              <div className="flex flex-wrap gap-3">
                {PRE_QUAL_REQUEST.projectSizes.map((size) => (
                  <button key={size} type="button" onClick={() => set("project_size", size)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                      v.project_size === size
                        ? "bg-teal border-teal text-cream"
                        : "border-teal/20 text-teal/70 hover:border-bronze hover:text-bronze"
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>How is this project similar to or different from your recent work?</Label>
              <textarea rows={3} value={v.similar_diff}
                onChange={(e) => set("similar_diff", e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-teal/15 bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20 transition resize-none" />
            </div>
          </Section>

          {/* Part 6 — Lending History */}
          <Section heading="Part 6 — Lending History">
            <Label>Other lenders you&apos;ve worked with</Label>
            <div className="space-y-3 mb-6">
              {v.lenders.map((row, i) => (
                <div key={i}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-cream-light border border-teal/10">
                  <div>
                    <MiniLabel>Lender</MiniLabel>
                    <MiniInput value={row.lender} onChange={(x) => setRow("lenders", i, "lender", x)} />
                  </div>
                  <div>
                    <MiniLabel># of loans</MiniLabel>
                    <MiniInput value={row.loans} onChange={(x) => setRow("lenders", i, "loans", x)} />
                  </div>
                  <div>
                    <MiniLabel>Still active?</MiniLabel>
                    <MiniInput value={row.active} onChange={(x) => setRow("lenders", i, "active", x)}
                      placeholder="Yes / No" />
                  </div>
                  <div>
                    <MiniLabel>Contact, if we may call</MiniLabel>
                    <MiniInput value={row.contact} onChange={(x) => setRow("lenders", i, "contact", x)} />
                  </div>
                </div>
              ))}
            </div>

            <Label>Have you ever:</Label>
            <div className="space-y-2 mb-5">
              {PRE_QUAL_REQUEST.everQuestions.map(({ key, q }) => (
                <div key={key}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-cream-light border border-teal/10">
                  <span className="text-teal/80 text-sm">{q}</span>
                  <div className="flex gap-2">
                    {["Yes", "No"].map((opt) => (
                      <button key={opt} type="button"
                        onClick={() => set("ever", { ...v.ever, [key]: opt })}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          v.ever[key] === opt
                            ? "bg-teal border-teal text-cream"
                            : "border-teal/20 text-teal/60 hover:border-bronze hover:text-bronze"
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Label>
                Explain any &quot;Yes&quot; answer
                <span className="block normal-case tracking-normal text-[11px] text-teal/45 font-normal mt-0.5">
                  A yes is not disqualifying — we&apos;d rather hear it from you now than find it later.
                </span>
              </Label>
              <textarea rows={3} value={v.ever_explain}
                onChange={(e) => set("ever_explain", e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-teal/15 bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20 transition resize-none" />
            </div>
          </Section>

          {/* Who To Contact */}
          <Section heading="Who To Contact">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Your name" required error={errors.name}
                value={v.name} onChange={(x) => set("name", x)} />
              <Field label="Phone" type="tel" required error={errors.phone}
                value={v.phone} onChange={(x) => set("phone", x)} />
              <div className="sm:col-span-2">
                <Field label="Email" type="email" required error={errors.email}
                  value={v.email} onChange={(x) => set("email", x)} />
              </div>
            </div>
          </Section>

          {/* Certification */}
          <Section heading="Certification">
            <div className="space-y-3">
              {PRE_QUAL_REQUEST.certifications.map((c, i) => (
                <label key={i}
                  className={`flex gap-4 p-4 rounded-xl bg-cream-light border cursor-pointer transition-colors ${
                    errors[`cert_${i}`] ? "border-red-300" : "border-teal/10 hover:border-bronze/40"
                  }`}>
                  <input type="checkbox" checked={!!v[`cert_${i}`]}
                    onChange={(e) => set(`cert_${i}`, e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-bronze flex-shrink-0" />
                  <span className="text-teal/80 text-sm leading-relaxed">{c}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Signature */}
          <Section heading="Signature">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Signed (type your name)" required error={errors.signature}
                value={v.signature} onChange={(x) => set("signature", x)} />
              <Field label="Printed name" required error={errors.signature_name}
                value={v.signature_name} onChange={(x) => set("signature_name", x)} />
              <Field label="Date" type="date" required error={errors.signature_date}
                value={v.signature_date} onChange={(x) => set("signature_date", x)} />
            </div>
          </Section>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-teal/10">
            <p className="text-teal/55 text-xs max-w-xs">
              A copy goes to our team the moment you submit.
            </p>
            <div className="flex items-center gap-4">
              {status === "error" && (
                <span className="text-red-600 text-sm">{serverError}</span>
              )}
              <button type="submit" disabled={status === "submitting"}
                className="btn-primary disabled:opacity-60">
                {status === "submitting" ? (
                  <><Loader2 size={18} className="animate-spin" /> Sending…</>
                ) : (
                  <>Request Pre-Qual Letter <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- bits */

function Section({ heading, children }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="bronze-bar !w-8" />
        <h3 className="eyebrow text-bronze">{heading}</h3>
      </div>
      {children}
    </section>
  );
}

function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
      {children}
      {required && <span className="text-bronze ml-1">*</span>}
    </label>
  );
}

function Field({ label, hint, required, type = "text", money, value, error, onChange, placeholder }) {
  return (
    <div>
      <Label required={required}>
        {label}
        {hint && (
          <span className="block normal-case tracking-normal text-[11px] text-teal/45 font-normal mt-0.5">
            {hint}
          </span>
        )}
      </Label>
      <div className="relative">
        {money && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal/40">$</span>
        )}
        <input
          type={money ? "text" : type}
          inputMode={money ? "numeric" : undefined}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full py-3.5 rounded-xl border bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:ring-2 transition ${
            money ? "pl-9 pr-4" : "px-4"
          } ${
            error
              ? "border-red-400 focus:ring-red-200"
              : "border-teal/15 focus:border-bronze focus:ring-bronze/20"
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function MiniLabel({ children }) {
  return (
    <div className="text-[10px] font-semibold tracking-widest uppercase text-teal/50 mb-1.5">
      {children}
    </div>
  );
}

function MiniInput({ value, onChange, placeholder, money, type = "text" }) {
  return (
    <div className="relative">
      {money && (
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal/40 text-sm">
          $
        </span>
      )}
      <input
        type={money ? "text" : type}
        value={value || ""}
        placeholder={placeholder}
        inputMode={money ? "numeric" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full py-2.5 rounded-lg border border-teal/15 bg-white text-teal text-sm placeholder:text-teal/35 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20 transition ${
          money ? "pl-6 pr-2.5" : "px-3"
        }`}
      />
    </div>
  );
}

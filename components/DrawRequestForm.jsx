"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Info, Loader2, Plus, X } from "lucide-react";
import { DRAW_REQUEST, computeDraw } from "@/lib/requestForms";
import { formatMoney, usd } from "@/lib/dealMath";

const emptyItem = () => ({ desc: "", inv: "", pay: "", amt: "", pct: "" });

const initial = {
  borrower: "",
  loan_no: "",
  mailing: "",
  draw_no: "",
  draw_date: "",
  property: "",
  reimbursement: "Wire",
  bank_name: "",
  acct_name: "",
  fr_holdback: "",
  fr_prev: "",
  fr_this: "",
  nd_fee: "",
  contact1: "",
  phone1: "",
  contact2: "",
  phone2: "",
  access: "",
  email: "",
  sig: "",
  sig_name: "",
  sig_title: "",
  sig_date: "",
  items: [emptyItem()],
};

export default function DrawRequestForm() {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const set = (k, val) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };

  const setItem = (i, key, val) =>
    setV((s) => ({
      ...s,
      items: s.items.map((r, ri) => (ri === i ? { ...r, [key]: val } : r)),
    }));

  const d = computeDraw(v);

  const validate = () => {
    const e = {};
    const need = {
      borrower: "Required",
      property: "Required",
      draw_no: "Required",
      draw_date: "Required",
      fr_holdback: "Required",
      fr_this: "Required",
      contact1: "Required",
      phone1: "Required",
      access: "Required",
      email: "Required",
      sig: "Required",
      sig_name: "Required",
      sig_date: "Required",
    };
    Object.entries(need).forEach(([k, msg]) => {
      if (!String(v[k] ?? "").trim()) e[k] = msg;
    });
    if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
    if (!d.items.length) e.items = "Add at least one item";
    else if (d.items.some((r) => !String(r.desc).trim() || !r.amt))
      e.items = "Every item needs a description and an amount";
    DRAW_REQUEST.certifications.forEach((_, i) => {
      if (!v[`cert_${i}`]) e[`cert_${i}`] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      document
        .querySelector("[data-draw-top]")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch(DRAW_REQUEST.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
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
          {DRAW_REQUEST.successTitle}
        </h2>
        <p className="text-teal/70 leading-relaxed mb-4">
          Thanks{v.sig_name ? `, ${v.sig_name.split(" ")[0]}` : ""}. Draw #
          {v.draw_no} for <strong className="text-teal">{v.property}</strong> is
          with us. {DRAW_REQUEST.successBody}
        </p>
        <p className="text-teal/60 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
          Email your photos, invoices, and last draw&apos;s bank statement to us
          now — the inspection can&apos;t be scheduled without them.
        </p>
        <Link href="/resources/forms" className="btn-primary">
          Back to resources <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" data-draw-top>
      <div className="mb-6 flex items-start gap-4 p-5 rounded-2xl bg-bronze/10 border border-bronze/25">
        <Info size={20} className="text-bronze flex-shrink-0 mt-0.5" />
        <p className="text-teal/80 text-sm leading-relaxed">
          Funds are released only after the completed work is inspected and
          verified. Interest accrues only on amounts advanced, so each draw
          increases your monthly payment.
        </p>
      </div>

      <div className="bg-cream rounded-3xl p-7 sm:p-9 shadow-xl border border-teal/5">
        <form onSubmit={submit} className="space-y-10">
          {/* Header */}
          <Section heading="Construction Draw Request">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Borrower" required error={errors.borrower}
                value={v.borrower} onChange={(x) => set("borrower", x)} />
              <Field label="Loan #" value={v.loan_no}
                onChange={(x) => set("loan_no", x)} placeholder="If you have it" />
              <div className="sm:col-span-2">
                <Field label="Property address" required error={errors.property}
                  value={v.property} onChange={(x) => set("property", x)} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Mailing address" value={v.mailing}
                  onChange={(x) => set("mailing", x)} />
              </div>
              <Field label="Draw #" required type="number" error={errors.draw_no}
                value={v.draw_no} onChange={(x) => set("draw_no", x)} placeholder="2" />
              <Field label="Date" required type="date" error={errors.draw_date}
                value={v.draw_date} onChange={(x) => set("draw_date", x)} />
            </div>
          </Section>

          {/* Reimbursement */}
          <Section heading="Reimbursement">
            <div className="mb-5">
              <Label>Reimbursement method</Label>
              <div className="flex flex-wrap gap-3">
                {DRAW_REQUEST.reimbursementMethods.map((m) => (
                  <button key={m} type="button" onClick={() => set("reimbursement", m)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                      v.reimbursement === m
                        ? "bg-teal border-teal text-cream"
                        : "border-teal/20 text-teal/70 hover:border-bronze hover:text-bronze"
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Bank name" value={v.bank_name}
                onChange={(x) => set("bank_name", x)} />
              <Field label="Name on account" value={v.acct_name}
                onChange={(x) => set("acct_name", x)} />
            </div>
            <p className="text-teal/50 text-xs mt-4 leading-relaxed">
              We pay to the account already on file. Don&apos;t send account or
              routing numbers through this form — if the account has changed, or
              the name on it differs from the borrower, call us at 214-740-4989
              before submitting.
            </p>
          </Section>

          {/* Funds request */}
          <Section heading="Funds Request">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Total construction holdback" money required
                error={errors.fr_holdback} value={v.fr_holdback}
                onChange={(x) => set("fr_holdback", formatMoney(x))} />
              <Field label="Less draws previously released" money value={v.fr_prev}
                onChange={(x) => set("fr_prev", formatMoney(x))} />
            </div>

            <Derived label="Balance available to draw" value={usd(d.available)} />

            <div className="mt-5">
              <Field label="Less this draw request" money required
                error={errors.fr_this} value={v.fr_this}
                onChange={(x) => set("fr_this", formatMoney(x))} />
            </div>

            <Derived label="Balance remaining after this draw" value={usd(d.after)}
              tone={d.after < 0 ? "warn" : "normal"} />

            {d.overAvailable && (
              <p className="text-red-600 text-sm mt-3">
                This draw is larger than the balance available. Check the numbers,
                or call us before submitting.
              </p>
            )}

            <div className="mt-7 pt-6 border-t border-teal/10">
              <div className="eyebrow text-bronze mb-4">Net Draw Funded</div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Derived label="Total draw requested" value={usd(d.thisDraw)} inline />
                <Field label="Less draw request fee" money value={v.nd_fee}
                  onChange={(x) => set("nd_fee", formatMoney(x))}
                  hint="Leave blank if you're not sure" />
              </div>
              <Derived label="Net draw funded" value={usd(d.net)} accent />
            </div>
          </Section>

          {/* Items to inspect */}
          <Section heading="Items To Inspect">
            <p className="text-teal/55 text-sm mb-5 leading-relaxed">
              Be as specific as possible. If an item can&apos;t be verified by the
              inspector, funds for that item may not be released.
            </p>

            <div className="space-y-3">
              {v.items.map((row, i) => (
                <div key={i}
                  className="grid grid-cols-2 sm:grid-cols-12 gap-3 items-end p-4 rounded-2xl bg-cream-light border border-teal/10">
                  <div className="col-span-2 sm:col-span-4">
                    <MiniLabel>Description of work / item</MiniLabel>
                    <MiniInput value={row.desc}
                      onChange={(x) => setItem(i, "desc", x)}
                      placeholder="Rough-in plumbing" />
                  </div>
                  <div className="sm:col-span-2">
                    <MiniLabel>Invoice #</MiniLabel>
                    <MiniInput value={row.inv} onChange={(x) => setItem(i, "inv", x)} />
                  </div>
                  <div className="sm:col-span-3">
                    <MiniLabel>Payable to</MiniLabel>
                    <MiniInput value={row.pay} onChange={(x) => setItem(i, "pay", x)}
                      placeholder="Delgado Build Co" />
                  </div>
                  <div className="sm:col-span-2">
                    <MiniLabel>Amount</MiniLabel>
                    <MiniInput money value={row.amt}
                      onChange={(x) => setItem(i, "amt", formatMoney(x))} />
                  </div>
                  <div className="sm:col-span-1 flex items-end gap-2">
                    <div className="flex-1">
                      <MiniLabel>%</MiniLabel>
                      <MiniInput value={row.pct}
                        onChange={(x) => setItem(i, "pct", x)} placeholder="100" />
                    </div>
                    {v.items.length > 1 && (
                      <button type="button" aria-label="Remove item"
                        onClick={() => setV((s) => ({
                          ...s, items: s.items.filter((_, ri) => ri !== i),
                        }))}
                        className="text-teal/40 hover:text-red-500 transition-colors pb-2.5">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {errors.items && (
              <p className="text-red-500 text-xs mt-2">{errors.items}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              {v.items.length < 17 && (
                <button type="button"
                  onClick={() => setV((s) => ({ ...s, items: [...s.items, emptyItem()] }))}
                  className="inline-flex items-center gap-2 text-bronze font-semibold text-sm hover:underline">
                  <Plus size={16} /> Add another item
                </button>
              )}
              <div className="ml-auto text-right">
                <div className="text-[10px] tracking-widest uppercase text-teal/50">
                  Total
                </div>
                <div className={`font-bold text-xl ${
                  d.items.length && !d.itemsMatch ? "text-red-600" : "text-teal"
                }`}>
                  {usd(d.itemsTotal)}
                </div>
              </div>
            </div>

            {d.items.length > 0 && !d.itemsMatch && d.thisDraw > 0 && (
              <p className="text-red-600 text-sm mt-3 leading-relaxed">
                These items total {usd(d.itemsTotal)} but the draw request is{" "}
                {usd(d.thisDraw)}. They should match before you submit.
              </p>
            )}
          </Section>

          {/* Access */}
          <Section heading="Property Access">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Contact 1" required error={errors.contact1}
                value={v.contact1} onChange={(x) => set("contact1", x)} />
              <Field label="Phone" required type="tel" error={errors.phone1}
                value={v.phone1} onChange={(x) => set("phone1", x)} />
              <Field label="Contact 2" value={v.contact2}
                onChange={(x) => set("contact2", x)} />
              <Field label="Phone" type="tel" value={v.phone2}
                onChange={(x) => set("phone2", x)} />
              <div className="sm:col-span-2">
                <Label required>Property access</Label>
                <textarea rows={2} value={v.access}
                  onChange={(e) => set("access", e.target.value)}
                  placeholder="If a lockbox is present, provide the code and location."
                  className={`w-full px-4 py-3.5 rounded-xl border bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:ring-2 transition resize-none ${
                    errors.access
                      ? "border-red-400 focus:ring-red-200"
                      : "border-teal/15 focus:border-bronze focus:ring-bronze/20"
                  }`} />
                {errors.access && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.access}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <Field label="Your email" required type="email" error={errors.email}
                  value={v.email} onChange={(x) => set("email", x)}
                  hint="Where we'll confirm the inspection" />
              </div>
            </div>
          </Section>

          {/* Attached */}
          <Section heading="Attached">
            <p className="text-teal/55 text-sm mb-5 leading-relaxed">
              Tick what you&apos;re sending, then email the files to us after
              submitting.
            </p>
            <div className="space-y-3">
              {DRAW_REQUEST.attachments.map((a, i) => (
                <label key={i}
                  className="flex gap-4 p-4 rounded-xl bg-cream-light border border-teal/10 hover:border-bronze/40 cursor-pointer transition-colors">
                  <input type="checkbox" checked={!!v[`att_${i}`]}
                    onChange={(e) => set(`att_${i}`, e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-bronze flex-shrink-0" />
                  <span className="text-teal/80 text-sm leading-relaxed">{a}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Certifications */}
          <Section heading="Borrower Certifies">
            <div className="space-y-3">
              {DRAW_REQUEST.certifications.map((c, i) => (
                <label key={i}
                  className={`flex gap-4 p-4 rounded-xl bg-cream-light border cursor-pointer transition-colors ${
                    errors[`cert_${i}`]
                      ? "border-red-300"
                      : "border-teal/10 hover:border-bronze/40"
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
              <Field label="Signed (type your name)" required error={errors.sig}
                value={v.sig} onChange={(x) => set("sig", x)} />
              <Field label="Printed name" required error={errors.sig_name}
                value={v.sig_name} onChange={(x) => set("sig_name", x)} />
              <Field label="Title" value={v.sig_title}
                onChange={(x) => set("sig_title", x)} placeholder="Managing Member" />
              <Field label="Date" required type="date" error={errors.sig_date}
                value={v.sig_date} onChange={(x) => set("sig_date", x)} />
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
                  <>Submit Draw Request <ArrowRight size={18} /></>
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

function Derived({ label, value, accent, tone, inline }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${
        accent ? "bg-bronze/10 mt-5" : "bg-teal/5"
      } ${inline ? "" : "mt-5"}`}
    >
      <span className="text-xs font-semibold tracking-widest uppercase text-teal/55">
        {label}
      </span>
      <span
        className={`font-bold ${accent ? "text-xl text-bronze" : "text-lg"} ${
          tone === "warn" ? "text-red-600" : accent ? "" : "text-teal"
        }`}
      >
        {value}
      </span>
    </div>
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

function MiniInput({ value, onChange, placeholder, money }) {
  return (
    <div className="relative">
      {money && (
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal/40 text-sm">
          $
        </span>
      )}
      <input
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

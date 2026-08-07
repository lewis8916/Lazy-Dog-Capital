"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Info, Loader2 } from "lucide-react";
import { allFields } from "@/lib/requestForms";
import Honeypot from "@/components/Honeypot";
import { formatMoney } from "@/lib/dealMath";
import { submitForm } from "@/lib/submitForm";

export default function RequestForm({ schema }) {
  const [values, setValues] = useState({});
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const set = (name, v) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
  };

  const validate = () => {
    const e = {};
    allFields(schema).forEach((f) => {
      const v = values[f.name];
      if (f.required && !String(v ?? "").trim()) {
        e[f.name] = "Required";
        return;
      }
      if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) {
        e[f.name] = "Enter a valid email";
      }
    });
    (schema.certifications || []).forEach((_, i) => {
      if (!values[`cert_${i}`]) e[`cert_${i}`] = "Required";
    });
    if (schema.signature) {
      if (!String(values.signature || "").trim()) e.signature = "Required";
      if (!String(values.signature_date || "").trim()) e.signature_date = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      document
        .querySelector("[data-req-top]")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setStatus("submitting");
    setServerError("");
    try {
      await submitForm(schema.endpoint, { ...values, ldc_hp: hp });
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
          {schema.successTitle}
        </h2>
        <p className="text-teal/70 leading-relaxed mb-8">
          Thanks{values.name ? `, ${values.name.split(" ")[0]}` : ""}.{" "}
          {schema.successBody}
        </p>
        <Link href="/resources/forms" className="btn-primary">
          Back to resources <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto" data-req-top>
      {schema.note && (
        <div className="mb-6 flex items-start gap-4 p-5 rounded-2xl bg-bronze/10 border border-bronze/25">
          <Info size={20} className="text-bronze flex-shrink-0 mt-0.5" />
          <p className="text-teal/80 text-sm leading-relaxed">{schema.note}</p>
        </div>
      )}

      <div className="bg-cream rounded-3xl p-7 sm:p-9 shadow-xl border border-teal/5">
        <form onSubmit={submit} className="space-y-10">
          <Honeypot value={hp} onChange={setHp} />
          {schema.sections.map((section) => (
            <section key={section.heading}>
              <div className="flex items-center gap-3 mb-6">
                <span className="bronze-bar !w-8" />
                <h3 className="eyebrow text-bronze">{section.heading}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {section.fields.map((f) => (
                  <div key={f.name} className={f.col === 2 ? "sm:col-span-2" : ""}>
                    <FieldControl
                      field={f}
                      value={values[f.name]}
                      error={errors[f.name]}
                      onChange={(v) => set(f.name, f.money ? formatMoney(v) : v)}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          {schema.certifications?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="bronze-bar !w-8" />
                <h3 className="eyebrow text-bronze">Certifications</h3>
              </div>
              <div className="space-y-3">
                {schema.certifications.map((c, i) => (
                  <label
                    key={i}
                    className={`flex gap-4 p-4 rounded-xl bg-cream-light border cursor-pointer transition-colors ${
                      errors[`cert_${i}`]
                        ? "border-red-300"
                        : "border-teal/10 hover:border-bronze/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!values[`cert_${i}`]}
                      onChange={(e) => set(`cert_${i}`, e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-bronze flex-shrink-0"
                    />
                    <span className="text-teal/80 text-sm leading-relaxed">{c}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          {schema.signature && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="bronze-bar !w-8" />
                <h3 className="eyebrow text-bronze">Signature</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <FieldControl
                  field={{
                    name: "signature",
                    label: "Type your full name",
                    required: true,
                  }}
                  value={values.signature}
                  error={errors.signature}
                  onChange={(v) => set("signature", v)}
                />
                <FieldControl
                  field={{
                    name: "signature_date",
                    label: "Date",
                    type: "date",
                    required: true,
                  }}
                  value={values.signature_date}
                  error={errors.signature_date}
                  onChange={(v) => set("signature_date", v)}
                />
              </div>
            </section>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-teal/10">
            <p className="text-teal/55 text-xs max-w-xs pt-4">
              A copy goes to our team the moment you submit.
            </p>
            <div className="flex items-center gap-4 pt-4">
              {status === "error" && (
                <span className="text-red-600 text-sm">{serverError}</span>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary disabled:opacity-60"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    {schema.submitLabel} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldControl({ field: f, value, error, onChange }) {
  const label = (
    <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
      {f.label}
      {f.required && <span className="text-bronze ml-1">*</span>}
      {f.hint && (
        <span className="block normal-case tracking-normal text-[11px] text-teal/45 font-normal mt-0.5">
          {f.hint}
        </span>
      )}
    </label>
  );

  const base = `w-full py-3.5 rounded-xl border bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:ring-2 transition ${
    error
      ? "border-red-400 focus:ring-red-200"
      : "border-teal/15 focus:border-bronze focus:ring-bronze/20"
  }`;

  if (f.type === "textarea") {
    return (
      <div>
        {label}
        <textarea
          rows={3}
          value={value || ""}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} px-4 resize-none`}
        />
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      </div>
    );
  }

  if (f.type === "select") {
    return (
      <div>
        {label}
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} px-4`}
        >
          <option value="">Select…</option>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      {label}
      <div className="relative">
        {f.money && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal/40">
            $
          </span>
        )}
        <input
          type={f.money ? "text" : f.type || "text"}
          inputMode={f.money ? "numeric" : undefined}
          value={value || ""}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} ${f.money ? "pl-9 pr-4" : "px-4"}`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

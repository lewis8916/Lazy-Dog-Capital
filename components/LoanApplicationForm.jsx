"use client";

import { useMemo, useState } from "react";
import Honeypot from "@/components/Honeypot";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Plus,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  CERTIFICATIONS,
  DECLARATIONS,
  MAX_PROJECT_ROWS,
  PROJECT_COLUMNS,
  STEPS,
} from "./loanApplicationSchema";

const emptyProjectRow = () =>
  PROJECT_COLUMNS.reduce((acc, c) => ({ ...acc, [c.key]: "" }), {});

const money = (v) => {
  const digits = String(v).replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
};

export default function LoanApplicationForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ projects: [emptyProjectRow()] });
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState("");

  const set = (name, v) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
  };

  const allFields = useMemo(
    () => STEPS.flatMap((s) => s.sections.flatMap((sec) => sec.fields)),
    []
  );

  const disqualified = DECLARATIONS.filter((d) => d.disqualifying).some(
    (d) => values[d.name] === "yes"
  );

  const validateStep = (i) => {
    const e = {};

    if (i < 3) {
      STEPS[i].sections.forEach((sec) =>
        sec.fields.forEach((f) => {
          const v = values[f.name];
          if (f.required && (v === undefined || String(v).trim() === "")) {
            e[f.name] = "Required";
            return;
          }
          if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) {
            e[f.name] = "Enter a valid email";
          }
          if (f.type === "radio" && v === "other") {
            const other = f.options.find((o) => o.otherField);
            if (other && !String(values[other.otherField] || "").trim()) {
              e[other.otherField] = "Please describe";
            }
          }
        })
      );
    } else {
      DECLARATIONS.forEach((d) => {
        if (!values[d.name]) e[d.name] = "Required";
      });
      CERTIFICATIONS.forEach((c) => {
        if (!values[c.name]) e[c.name] = "Required";
      });
      if (!String(values.s_entity || "").trim()) e.s_entity = "Required";
      if (!String(values.s1_name || "").trim()) e.s1_name = "Required";
      if (!String(values.s1_sig || "").trim()) e.s1_sig = "Required";
      if (!String(values.s1_date || "").trim()) e.s1_date = "Required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) {
      document
        .querySelector("[data-form-top]")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    document
      .querySelector("[data-form-top]")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    document
      .querySelector("[data-form-top]")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validateStep(step)) return;
    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ldc_hp: hp }),
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
      <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-bronze/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={44} className="text-bronze" />
        </div>
        <h2 className="display text-teal text-3xl sm:text-4xl mb-4">
          Application received.
        </h2>
        <p className="text-teal/70 leading-relaxed mb-8">
          Thanks{values.g1_name ? `, ${values.g1_name.split(" ")[0]}` : ""}. We have
          your application for{" "}
          <strong className="text-teal">{values.pr_addr}</strong>. A member of our
          team will review the numbers and reach out to{" "}
          <strong className="text-teal">{values.e_email}</strong> to walk through
          your terms.
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-teal/60">
          <span className="w-2 h-2 rounded-full bg-bronze" />
          Nothing you submitted is a commitment to lend.
        </div>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div data-form-top>
      {/* Progress */}
      <div className="mb-12">
        <div className="flex items-center gap-2 sm:gap-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                    i < step
                      ? "bg-bronze text-cream"
                      : i === step
                        ? "bg-teal text-cream"
                        : "bg-teal/10 text-teal/40"
                  }`}
                >
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span
                  className={`hidden sm:block text-sm font-semibold whitespace-nowrap ${
                    i === step ? "text-teal" : "text-teal/40"
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px bg-teal/15 min-w-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="display text-teal text-3xl sm:text-4xl mb-3">
          {current.title}
        </h2>
        <p className="text-teal/70 leading-relaxed">{current.blurb}</p>
      </div>

      <form onSubmit={step === STEPS.length - 1 ? submit : (e) => e.preventDefault()}>
        <Honeypot value={hp} onChange={setHp} />
        {step < 3 ? (
          <div className="space-y-12">
            {current.sections.map((sec) => (
              <section key={sec.heading}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bronze-bar !w-8" />
                  <h3 className="eyebrow text-bronze">{sec.heading}</h3>
                  {sec.optional && (
                    <span className="text-[10px] uppercase tracking-widest text-teal/35">
                      Optional
                    </span>
                  )}
                </div>
                {sec.note && (
                  <p className="text-teal/55 text-sm mb-5 max-w-2xl">{sec.note}</p>
                )}
                <div className="grid sm:grid-cols-2 gap-5 mt-5">
                  {sec.fields.map((f) => (
                    <Field
                      key={f.name}
                      field={f}
                      values={values}
                      errors={errors}
                      set={set}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <DeclarationsStep
            values={values}
            errors={errors}
            set={set}
            disqualified={disqualified}
          />
        )}

        {/* Nav */}
        <div className="mt-12 pt-8 border-t border-teal/10 flex flex-wrap items-center justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-2 text-teal/70 hover:text-bronze font-semibold transition-colors"
            >
              <ArrowLeft size={18} /> Back
            </button>
          ) : (
            <span className="text-teal/45 text-xs">
              Step {step + 1} of {STEPS.length}
            </span>
          )}

          <div className="flex items-center gap-4 ml-auto">
            {status === "error" && (
              <span className="text-red-600 text-sm">{serverError}</span>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="btn-primary">
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting" || disqualified}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    Submit Application <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------- Declarations */

function DeclarationsStep({ values, errors, set, disqualified }) {
  const projects = values.projects || [];

  const setRow = (i, key, v) => {
    const rows = projects.map((r, ri) => (ri === i ? { ...r, [key]: v } : r));
    set("projects", rows);
  };

  return (
    <div className="space-y-12">
      {/* Declarations */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="bronze-bar !w-8" />
          <h3 className="eyebrow text-bronze">Declarations</h3>
        </div>
        <p className="text-teal/55 text-sm mb-6 max-w-2xl">
          Answer for the borrowing entity and every principal. We will ask you to
          explain any &ldquo;Yes&rdquo; answer.
        </p>

        <div className="rounded-2xl border border-teal/10 divide-y divide-teal/10 overflow-hidden">
          {DECLARATIONS.map((d) => (
            <div
              key={d.name}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white"
            >
              <span className="text-teal flex-1 text-[15px] leading-relaxed">
                {d.q}
                {errors[d.name] && (
                  <span className="block text-red-500 text-xs mt-1">Required</span>
                )}
              </span>
              <div className="flex gap-2 flex-shrink-0">
                {["yes", "no"].map((opt) => {
                  const active = values[d.name] === opt;
                  const bad = d.disqualifying && opt === "yes" && active;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set(d.name, opt)}
                      className={`px-6 py-2 rounded-full text-sm font-semibold capitalize border transition-colors ${
                        active
                          ? bad
                            ? "bg-red-500 border-red-500 text-white"
                            : "bg-teal border-teal text-cream"
                          : "border-teal/20 text-teal/70 hover:border-bronze hover:text-bronze"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {disqualified && (
          <div className="mt-5 flex gap-3 p-5 rounded-2xl bg-red-50 border border-red-200">
            <TriangleAlert size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm leading-relaxed">
              A &ldquo;Yes&rdquo; to owner occupancy or homestead means this loan
              cannot be made. Lazy Dog Capital lends only on non-homestead
              investment property. Please correct your answer or contact us to
              discuss the deal.
            </p>
          </div>
        )}
      </section>

      {/* Recent projects */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="bronze-bar !w-8" />
          <h3 className="eyebrow text-bronze">Recent Projects</h3>
          <span className="text-[10px] uppercase tracking-widest text-teal/35">
            Last 24 months · Optional
          </span>
        </div>
        <p className="text-teal/55 text-sm mb-6 max-w-2xl">
          Your track record helps us size the deal. Leave blank if this is your
          first project.
        </p>

        <div className="space-y-4">
          {projects.map((row, i) => (
            <div
              key={i}
              className="grid sm:grid-cols-6 gap-3 items-end p-4 rounded-2xl bg-white border border-teal/10"
            >
              {PROJECT_COLUMNS.map((c) => (
                <div key={c.key} className={c.col === 2 ? "sm:col-span-2" : ""}>
                  <label className="block text-[10px] font-semibold tracking-widest uppercase text-teal/50 mb-1.5">
                    {c.label}
                  </label>
                  <div className="relative">
                    {c.money && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal/40 text-sm">
                        $
                      </span>
                    )}
                    <input
                      type={c.type || "text"}
                      value={row[c.key] || ""}
                      onChange={(e) =>
                        setRow(i, c.key, c.money ? money(e.target.value) : e.target.value)
                      }
                      className={`w-full py-2.5 rounded-lg border border-teal/15 bg-cream-light text-teal text-sm focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20 transition ${
                        c.money ? "pl-7 pr-3" : "px-3"
                      }`}
                    />
                  </div>
                </div>
              ))}
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "projects",
                      projects.filter((_, ri) => ri !== i)
                    )
                  }
                  className="text-teal/40 hover:text-red-500 transition-colors justify-self-start sm:justify-self-center pb-2.5"
                  aria-label="Remove project"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {projects.length < MAX_PROJECT_ROWS && (
          <button
            type="button"
            onClick={() => set("projects", [...projects, emptyProjectRow()])}
            className="mt-4 inline-flex items-center gap-2 text-bronze font-semibold text-sm hover:underline"
          >
            <Plus size={16} /> Add another project
          </button>
        )}
      </section>

      {/* Certifications */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="bronze-bar !w-8" />
          <h3 className="eyebrow text-bronze">Authorization & Certification</h3>
        </div>
        <div className="space-y-3 mt-5">
          {CERTIFICATIONS.map((c) => (
            <label
              key={c.name}
              className={`flex gap-4 p-4 rounded-xl bg-white border cursor-pointer transition-colors ${
                errors[c.name] ? "border-red-300" : "border-teal/10 hover:border-bronze/40"
              }`}
            >
              <input
                type="checkbox"
                checked={!!values[c.name]}
                onChange={(e) => set(c.name, e.target.checked)}
                className="mt-1 w-4 h-4 accent-bronze flex-shrink-0"
              />
              <span className="text-teal/80 text-sm leading-relaxed">{c.text}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Signatures */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="bronze-bar !w-8" />
          <h3 className="eyebrow text-bronze">Credit Authorization & Signatures</h3>
        </div>
        <p className="text-teal/55 text-sm mb-6 max-w-2xl">
          By typing your name below, each principal authorizes Lazy Dog Capital LLC
          to obtain consumer credit reports and background checks, and to verify the
          information in this application.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Input
              label="Borrowing entity"
              value={values.s_entity}
              error={errors.s_entity}
              onChange={(v) => set("s_entity", v)}
            />
          </div>
        </div>

        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="mt-5 p-5 rounded-2xl bg-white border border-teal/10 grid sm:grid-cols-3 gap-5"
          >
            <Input
              label={`Principal ${n} — printed name`}
              value={values[`s${n}_name`]}
              error={errors[`s${n}_name`]}
              onChange={(v) => set(`s${n}_name`, v)}
            />
            <Input
              label="Signature (type full name)"
              value={values[`s${n}_sig`]}
              error={errors[`s${n}_sig`]}
              onChange={(v) => set(`s${n}_sig`, v)}
              className="font-[cursive]"
            />
            <Input
              label="Date"
              type="date"
              value={values[`s${n}_date`]}
              error={errors[`s${n}_date`]}
              onChange={(v) => set(`s${n}_date`, v)}
            />
          </div>
        ))}
      </section>

      {/* Notes */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="bronze-bar !w-8" />
          <h3 className="eyebrow text-bronze">Anything Else</h3>
        </div>
        <textarea
          rows={4}
          value={values.notes || ""}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Explain any 'Yes' answers above, or tell us anything else about the deal…"
          className="w-full px-4 py-3.5 rounded-xl border border-teal/15 bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20 transition resize-none"
        />
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- Field types */

function Field({ field: f, values, errors, set }) {
  const span = f.col === 2 ? "sm:col-span-2" : "";

  if (f.type === "radio") {
    const other = f.options.find((o) => o.otherField);
    return (
      <div className={span}>
        <Label label={f.label} error={errors[f.name]} />
        <div className="flex flex-wrap gap-3">
          {f.options.map((o) => {
            const active = values[f.name] === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => set(f.name, o.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                  active
                    ? "bg-teal border-teal text-cream"
                    : "border-teal/20 text-teal/70 hover:border-bronze hover:text-bronze"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
        {other && values[f.name] === "other" && (
          <div className="mt-3">
            <input
              value={values[other.otherField] || ""}
              onChange={(e) => set(other.otherField, e.target.value)}
              placeholder="Please describe"
              className={`w-full px-4 py-3 rounded-xl border bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:ring-2 transition ${
                errors[other.otherField]
                  ? "border-red-400 focus:ring-red-200"
                  : "border-teal/15 focus:border-bronze focus:ring-bronze/20"
              }`}
            />
            {errors[other.otherField] && (
              <p className="text-red-500 text-xs mt-1.5">{errors[other.otherField]}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (f.type === "select") {
    return (
      <div className={span}>
        <Label label={f.label} required={f.required} error={errors[f.name]} />
        <select
          value={values[f.name] || ""}
          onChange={(e) => set(f.name, e.target.value)}
          className={`w-full px-4 py-3.5 rounded-xl border bg-cream-light text-teal focus:outline-none focus:ring-2 transition ${
            errors[f.name]
              ? "border-red-400 focus:ring-red-200"
              : "border-teal/15 focus:border-bronze focus:ring-bronze/20"
          }`}
        >
          <option value="">Select…</option>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {errors[f.name] && <p className="text-red-500 text-xs mt-1.5">{errors[f.name]}</p>}
      </div>
    );
  }

  return (
    <div className={span}>
      <Input
        label={f.label}
        hint={f.hint}
        required={f.required}
        type={f.type}
        money={f.money}
        placeholder={f.placeholder}
        value={values[f.name]}
        error={errors[f.name]}
        onChange={(v) => set(f.name, f.money ? money(v) : v)}
      />
    </div>
  );
}

function Label({ label, hint, required, error }) {
  return (
    <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
      {label}
      {required && <span className="text-bronze ml-1">*</span>}
      {hint && (
        <span className="block normal-case tracking-normal text-[11px] text-teal/45 font-normal mt-0.5">
          {hint}
        </span>
      )}
      {error && (
        <span className="block normal-case tracking-normal text-[11px] text-red-500 font-normal mt-1">
          {error}
        </span>
      )}
    </label>
  );
}

function Input({
  label,
  hint,
  required,
  type = "text",
  money: isMoney,
  placeholder,
  value,
  error,
  onChange,
  className = "",
}) {
  return (
    <div>
      <Label label={label} hint={hint} required={required} />
      <div className="relative">
        {isMoney && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal/40">$</span>
        )}
        <input
          type={isMoney ? "text" : type}
          inputMode={isMoney ? "numeric" : undefined}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full py-3.5 rounded-xl border bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:ring-2 transition ${
            isMoney ? "pl-9 pr-4" : "px-4"
          } ${
            error
              ? "border-red-400 focus:ring-red-200"
              : "border-teal/15 focus:border-bronze focus:ring-bronze/20"
          } ${className}`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

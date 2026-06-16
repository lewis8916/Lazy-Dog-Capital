"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

const loanTypes = [
  "Fix & Flip",
  "Ground-Up Construction",
  "Bridge Loan",
  "Rental / DSCR",
  "Not sure yet",
];

const initial = {
  name: "",
  email: "",
  phone: "",
  loanType: "Fix & Flip",
  loanAmount: "",
  propertyAddress: "",
  message: "",
};

export default function ApplicationForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [errors, setErrors] = useState({});

  const update = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: null });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.loanAmount.trim()) e.loanAmount = "Required";
    if (!form.propertyAddress.trim()) e.propertyAddress = "Required";
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("success");
  };

  return (
    <section
      id="apply"
      className="section relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a2f29 0%, #21413A 60%, #2a5249 100%)",
      }}
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-bronze/8 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-bronze/5 blur-3xl" />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <span className="bronze-bar" />
              <span className="eyebrow text-bronze">Apply Now</span>
            </div>
            <h2 className="display text-cream text-4xl sm:text-5xl mb-6">
              Get a term sheet today.
            </h2>
            <p className="text-cream/75 text-lg leading-relaxed mb-10">
              Tell us about your deal. A senior loan officer will reach out within
              four business hours with an indicative quote — no obligation, no
              soft credit pull.
            </p>

            <div className="space-y-5">
              {[
                ["1", "Submit your deal", "30 seconds — no credit check"],
                ["2", "Talk to a real human", "Within 4 business hours"],
                ["3", "Sign and close", "Average 7 days to wire"],
              ].map(([n, t, d]) => (
                <div key={n} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border border-bronze/40 text-bronze font-bold flex items-center justify-center flex-shrink-0">
                    {n}
                  </div>
                  <div>
                    <div className="text-cream font-semibold">{t}</div>
                    <div className="text-cream/60 text-sm mt-0.5">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-cream rounded-3xl p-8 sm:p-10 shadow-2xl relative">
              {status === "success" ? (
                <div className="py-12 text-center animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-bronze/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={44} className="text-bronze" />
                  </div>
                  <h3 className="display text-teal text-3xl mb-3">
                    Application received.
                  </h3>
                  <p className="text-teal/70 max-w-md mx-auto leading-relaxed">
                    Thanks, {form.name.split(" ")[0]}. A loan officer will reach
                    out to <strong>{form.email}</strong> within four business hours.
                  </p>
                  <button
                    onClick={() => {
                      setForm(initial);
                      setStatus("idle");
                    }}
                    className="mt-8 text-bronze font-semibold hover:underline"
                  >
                    Submit another deal →
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="Full Name"
                    value={form.name}
                    onChange={update("name")}
                    error={errors.name}
                    placeholder="Jane Doe"
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    error={errors.email}
                    placeholder="jane@example.com"
                  />
                  <Field
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    error={errors.phone}
                    placeholder="(555) 123-4567"
                  />
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
                      Loan Type
                    </label>
                    <select
                      value={form.loanType}
                      onChange={update("loanType")}
                      className="w-full px-4 py-3.5 rounded-xl border border-teal/15 bg-cream-light text-teal focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20 transition"
                    >
                      {loanTypes.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <Field
                    label="Loan Amount"
                    value={form.loanAmount}
                    onChange={update("loanAmount")}
                    error={errors.loanAmount}
                    placeholder="$500,000"
                  />
                  <Field
                    label="Property Address"
                    value={form.propertyAddress}
                    onChange={update("propertyAddress")}
                    error={errors.propertyAddress}
                    placeholder="123 Main St, City, ST"
                  />

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
                      Tell us about the deal (optional)
                    </label>
                    <textarea
                      value={form.message}
                      onChange={update("message")}
                      rows={3}
                      placeholder="Purchase price, rehab budget, ARV, timeline…"
                      className="w-full px-4 py-3.5 rounded-xl border border-teal/15 bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20 transition resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between gap-4 flex-wrap mt-2">
                    <p className="text-teal/55 text-xs">
                      By submitting you agree to be contacted. We never sell your data.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn-primary disabled:opacity-70"
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
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3.5 rounded-xl border bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:ring-2 transition ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-teal/15 focus:border-bronze focus:ring-bronze/20"
        }`}
      />
      {error && <div className="text-red-500 text-xs mt-1.5">{error}</div>}
    </div>
  );
}

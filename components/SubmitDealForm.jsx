"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { computeDeal, formatMoney as money, parseMoney } from "@/lib/dealMath";

const initial = {
  name: "",
  phone: "",
  email: "",
  address: "",
  price: "",
  rehab: "",
  arv: "",
  months: "",
  exit: "sell",
  notes: "",
};

export default function SubmitDealForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const set = (k) => (e) => {
    const raw = e.target.value;
    const v = ["price", "rehab", "arv"].includes(k) ? money(raw) : raw;
    setForm((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: null }));
  };

  const num = parseMoney;

  // Live sanity check against the 80%-of-ARV cap — same math the deal
  // calculator and the notification email use.
  const { down, loanNeeded, cap, inRange, ready: showCheck } = computeDeal(form);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Required";
    if (!num(form.price)) e.price = "Required";
    if (!num(form.rehab)) e.rehab = "Required";
    if (!num(form.arv)) e.arv = "Required";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/submit-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
          Got it — we&apos;re looking at it.
        </h2>
        <p className="text-teal/70 leading-relaxed mb-8">
          Thanks, {form.name.split(" ")[0]}. We have your deal on{" "}
          <strong className="text-teal">{form.address}</strong> and we&apos;ll call
          you at <strong className="text-teal">{form.phone}</strong> to talk through
          the numbers.
        </p>
        <Link href="/apply" className="btn-primary">
          Start the full application <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-cream rounded-3xl p-8 sm:p-10 shadow-xl border border-teal/5">
        <form onSubmit={submit} className="space-y-10">
          {/* Contact */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bronze-bar !w-8" />
              <h3 className="eyebrow text-bronze">How To Reach You</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <Input
                label="Your name"
                required
                value={form.name}
                error={errors.name}
                onChange={set("name")}
                placeholder="Jane Doe"
              />
              <Input
                label="Phone"
                type="tel"
                required
                value={form.phone}
                error={errors.phone}
                onChange={set("phone")}
                placeholder="(214) 555-0123"
              />
              <Input
                label="Email"
                type="email"
                required
                value={form.email}
                error={errors.email}
                onChange={set("email")}
                placeholder="jane@example.com"
              />
            </div>
          </section>

          {/* Deal */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bronze-bar !w-8" />
              <h3 className="eyebrow text-bronze">The Deal</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Input
                  label="Property address"
                  required
                  value={form.address}
                  error={errors.address}
                  onChange={set("address")}
                  placeholder="1418 Marlow Dr, Garland, TX 75042"
                />
              </div>
              <Input
                label="Purchase price"
                money
                required
                value={form.price}
                error={errors.price}
                onChange={set("price")}
                placeholder="310,000"
              />
              <Input
                label="Rehab budget"
                money
                required
                value={form.rehab}
                error={errors.rehab}
                onChange={set("rehab")}
                placeholder="78,000"
              />
              <Input
                label="Value after repairs"
                hint="What you think it sells for finished"
                money
                required
                value={form.arv}
                error={errors.arv}
                onChange={set("arv")}
                placeholder="465,000"
              />
              <Input
                label="Months to complete"
                type="number"
                value={form.months}
                onChange={set("months")}
                placeholder="5"
              />

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
                  Exit strategy
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    ["sell", "Sell"],
                    ["refi", "Refinance and hold"],
                    ["unsure", "Not sure yet"],
                  ].map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForm((s) => ({ ...s, exit: v }))}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                        form.exit === v
                          ? "bg-teal border-teal text-cream"
                          : "border-teal/20 text-teal/70 hover:border-bronze hover:text-bronze"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {showCheck && (
              <div className="mt-6 p-5 rounded-2xl bg-teal/5 border border-teal/10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-teal/50 mb-1">
                      Your 10% down
                    </div>
                    <div className="text-teal font-bold text-lg">
                      ${down.toLocaleString("en-US")}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-teal/50 mb-1">
                      Loan you&apos;d need
                    </div>
                    <div className="text-teal font-bold text-lg">
                      ${loanNeeded.toLocaleString("en-US")}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-teal/50 mb-1">
                      80% of your ARV
                    </div>
                    <div className="text-teal font-bold text-lg">
                      ${cap.toLocaleString("en-US")}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-teal/50 mb-1">
                      Rough fit
                    </div>
                    <div
                      className={`font-bold text-lg ${
                        inRange ? "text-bronze" : "text-red-600"
                      }`}
                    >
                      {inRange ? "In range" : "Tight"}
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-teal/10">
                  <p className="text-bronze font-bold text-base sm:text-lg leading-snug">
                    Tight doesn&apos;t mean no — we make tight deals work.
                  </p>
                  <p className="text-teal/50 text-xs mt-2 leading-relaxed">
                    A rough guide only. We size every loan on our own review of the
                    property and the comps — send it either way.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Notes */}
          <section>
            <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
              Anything else about the deal?
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={set("notes")}
              placeholder="Under contract already? Scope of work? Timeline pressure?"
              className="w-full px-4 py-3.5 rounded-xl border border-teal/15 bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20 transition resize-none"
            />
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-teal/55 text-xs max-w-xs">
              No credit pull, no obligation. We&apos;ll call to talk through the
              numbers.
            </p>
            <div className="flex items-center gap-4">
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
                    Submit a Deal <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <p className="text-center text-teal/60 text-sm mt-8">
        Ready to go all the way?{" "}
        <Link href="/apply" className="text-bronze font-semibold hover:underline">
          Start the full application
        </Link>
      </p>
    </div>
  );
}

function Input({
  label,
  hint,
  required,
  type = "text",
  money: isMoney,
  value,
  error,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
        {label}
        {required && <span className="text-bronze ml-1">*</span>}
        {hint && (
          <span className="block normal-case tracking-normal text-[11px] text-teal/45 font-normal mt-0.5">
            {hint}
          </span>
        )}
      </label>
      <div className="relative">
        {isMoney && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal/40">$</span>
        )}
        <input
          type={isMoney ? "text" : type}
          inputMode={isMoney ? "numeric" : undefined}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-3.5 rounded-xl border bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:ring-2 transition ${
            isMoney ? "pl-9 pr-4" : "px-4"
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

"use client";

import { useState } from "react";
import Link from "next/link";
import Honeypot from "@/components/Honeypot";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calculator,
} from "lucide-react";

const TOPICS = [
  "A deal I'm looking at",
  "A loan already in progress",
  "General question",
  "Partner or broker inquiry",
  "Something else",
];

const initial = {
  name: "",
  email: "",
  phone: "",
  topic: TOPICS[0],
  prefer: "phone",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const set = (k) => (e) => {
    setForm((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.message.trim()) e.message = "Tell us a little about it";
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ldc_hp: hp }),
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
          Message received.
        </h2>
        <p className="text-teal/70 leading-relaxed mb-8">
          Thanks, {form.name.split(" ")[0]}. We&apos;ll get back to you
          {form.prefer === "phone" ? (
            <>
              {" "}
              by phone at <strong className="text-teal">{form.phone}</strong>
            </>
          ) : (
            <>
              {" "}
              by email at <strong className="text-teal">{form.email}</strong>
            </>
          )}
          . If it&apos;s urgent, call us at{" "}
          <a href="tel:+12147404989" className="text-bronze font-semibold">
            214-740-4989
          </a>
          .
        </p>
        <Link href="/submit-deal" className="btn-primary">
          Submit a deal <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-6">
      {/* Form */}
      <div className="lg:col-span-3">
        <div className="bg-cream rounded-3xl p-7 sm:p-8 shadow-xl border border-teal/5">
          <form onSubmit={submit} className="space-y-6">
            <Honeypot value={hp} onChange={setHp} />
            <div className="flex items-center gap-3">
              <span className="bronze-bar !w-8" />
              <h3 className="eyebrow text-bronze">Send Us A Note</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
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
              <div className="sm:col-span-2">
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
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
                What&apos;s this about?
              </label>
              <select
                value={form.topic}
                onChange={set("topic")}
                className="w-full px-4 py-3.5 rounded-xl border border-teal/15 bg-cream-light text-teal focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20 transition"
              >
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
                Message <span className="text-bronze">*</span>
              </label>
              <textarea
                rows={5}
                value={form.message}
                onChange={set("message")}
                placeholder="Tell us what you're working on or what you'd like to know…"
                className={`w-full px-4 py-3.5 rounded-xl border bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:ring-2 transition resize-none ${
                  errors.message
                    ? "border-red-400 focus:ring-red-200"
                    : "border-teal/15 focus:border-bronze focus:ring-bronze/20"
                }`}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
                Best way to reach you
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  ["phone", "Phone"],
                  ["email", "Email"],
                  ["either", "Either is fine"],
                ].map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, prefer: v }))}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                      form.prefer === v
                        ? "bg-teal border-teal text-cream"
                        : "border-teal/20 text-teal/70 hover:border-bronze hover:text-bronze"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-teal/55 text-xs max-w-[16rem]">
                No credit pull, no obligation. We never sell your information.
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
                      Send Message <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Side panel */}
      <div className="lg:col-span-2 space-y-5">
        <div
          className="relative overflow-hidden rounded-3xl noise p-7"
          style={{
            background:
              "radial-gradient(ellipse at top right, #2a5249 0%, #1E3C36 55%, #16302B 100%)",
          }}
        >
          <div className="absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full border border-bronze/20" />
          <div className="relative z-10">
            <div className="eyebrow text-bronze mb-5">Reach Us Direct</div>
            <div className="space-y-5">
              <a
                href="tel:+12147404989"
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-bronze/15 flex items-center justify-center flex-shrink-0">
                  <Phone size={17} className="text-bronze" />
                </div>
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-cream/40">
                    Call us
                  </div>
                  <div className="text-cream font-semibold group-hover:text-bronze transition-colors">
                    214-740-4989
                  </div>
                </div>
              </a>

              <a
                href="mailto:loans@lazydogcapital.com"
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-bronze/15 flex items-center justify-center flex-shrink-0">
                  <Mail size={17} className="text-bronze" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] tracking-widest uppercase text-cream/40">
                    Email us
                  </div>
                  <div className="text-cream font-semibold group-hover:text-bronze transition-colors break-all">
                    loans@lazydogcapital.com
                  </div>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-bronze/15 flex items-center justify-center flex-shrink-0">
                  <MapPin size={17} className="text-bronze" />
                </div>
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-cream/40">
                    Office
                  </div>
                  <div className="text-cream/90 text-sm leading-relaxed">
                    3400 N Central Expy
                    <br />
                    #110-217
                    <br />
                    Richardson, TX 75080
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-bronze/15 flex items-center justify-center flex-shrink-0">
                  <Clock size={17} className="text-bronze" />
                </div>
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-cream/40">
                    Lending in
                  </div>
                  <div className="text-cream/90 text-sm">
                    Dallas–Fort Worth
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-cream rounded-3xl p-7 shadow-xl border border-teal/5">
          <Calculator size={22} className="text-bronze mb-4" />
          <h3 className="display text-teal text-xl mb-2">
            Have a specific house in mind?
          </h3>
          <p className="text-teal/65 text-sm leading-relaxed mb-5">
            Skip the back and forth — run the numbers, then send the deal
            straight over.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/deal-calculator"
              className="text-bronze font-semibold text-sm hover:underline inline-flex items-center gap-2"
            >
              Open the calculator <ArrowRight size={15} />
            </Link>
            <Link
              href="/submit-deal"
              className="text-bronze font-semibold text-sm hover:underline inline-flex items-center gap-2"
            >
              Submit a deal <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, required, type = "text", value, error, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
        {label}
        {required && <span className="text-bronze ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3.5 rounded-xl border bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:ring-2 transition ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-teal/15 focus:border-bronze focus:ring-bronze/20"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

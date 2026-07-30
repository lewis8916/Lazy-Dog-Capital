import { Suspense } from "react";
import SubmitDealForm from "@/components/SubmitDealForm";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Submit a Deal — Lazy Dog Capital",
  description:
    "Send us the address, the price, and your rehab budget. We'll tell you what we'd lend and what it would cost. No credit pull, no obligation.",
};

export default function SubmitDealPage() {
  return (
    <>
      <PageHeader
        eyebrow="Submit a Deal"
        title="Found a house? Send it over."
        blurb="Four numbers and how to reach you — that's all we need to tell you what we'd lend. No credit pull, no paperwork, no obligation."
      />
      <section className="section bg-cream-light">
        <div className="container-x">
          <Suspense
            fallback={
              <div className="max-w-3xl mx-auto h-96 rounded-3xl bg-cream animate-pulse" />
            }
          >
            <SubmitDealForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}

import DealCalculator from "@/components/DealCalculator";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Deal Calculator",
  description:
    "Run the numbers on a fix & flip before you call anyone. Purchase price, rehab budget, and after-repair value — see the loan you'd need against our 80% of ARV cap.",
};

export default function DealCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Deal Calculator"
        title="Run the numbers first."
        blurb="Three figures and you'll know roughly where a deal lands. Nothing is sent, nothing is saved — this is just the math we'd run ourselves."
      />
      <section className="section bg-cream-light">
        <div className="container-x">
          <DealCalculator />
        </div>
      </section>
    </>
  );
}

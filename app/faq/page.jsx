import FAQ from "@/components/FAQ";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "FAQ",
  description:
    "Straight answers about our fix & flip loans: borrowing limits, costs, draws, early payoff, and what we need to look at your deal.",
};

export default function FAQPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Straight answers."
        blurb="The questions every borrower asks, answered the way we'd want them answered."
      />
      <FAQ />
    </>
  );
}

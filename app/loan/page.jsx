import Products from "@/components/Products";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "The Loan",
  description:
    "How our fix & flip loan works: one loan covers purchase and rehab, capped at 80% of after-repair value, with staged draws and no prepayment penalty.",
};

export default function LoanPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Loan"
        title="One loan. Purchase and rehab."
        blurb="Everything you need to take a house from closing table to finish line — structured the way operators would structure it for themselves."
      />
      <Products />
    </>
  );
}

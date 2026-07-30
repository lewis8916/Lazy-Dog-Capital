import LoanApplicationForm from "@/components/LoanApplicationForm";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Loan Application — Lazy Dog Capital",
  description:
    "Apply for a fix-and-flip loan secured by a first lien on Texas investment property. Tell us about the entity, the principals, and the deal.",
};

export default function ApplyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Loan Application"
        title="Let's look at your deal."
        blurb="Fix-and-flip loan secured by a first lien on Texas investment property. Four short steps — it costs nothing to hear your terms."
      />
      <section className="section bg-cream-light">
        <div className="container-x">
          <LoanApplicationForm />
        </div>
      </section>
    </>
  );
}

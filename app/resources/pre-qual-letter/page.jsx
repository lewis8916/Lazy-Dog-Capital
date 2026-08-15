import PreQualForm from "@/components/PreQualForm";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Get Pre-Qual Letter",
  description:
    "Request a pre-qualification letter from Lazy Dog Capital. Tell us about your funds, your track record, and your lending history and we'll get a letter back to you.",
};

export default function PreQualLetterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Get your pre-qual letter."
        blurb="Proof of funds, your track record, and your lending history — fill it out once and we'll get a pre-qualification letter back to you."
      />
      <section className="section bg-cream-light">
        <div className="container-x">
          <PreQualForm />
        </div>
      </section>
    </>
  );
}

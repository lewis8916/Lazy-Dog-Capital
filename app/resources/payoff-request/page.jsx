import RequestForm from "@/components/RequestForm";
import PageHeader from "@/components/PageHeader";
import { PAYOFF_REQUEST } from "@/lib/requestForms";

export const metadata = {
  title: "Payoff Request — Lazy Dog Capital",
  description:
    "Request a payoff statement on an active Lazy Dog Capital loan. Tell us your closing date and title company and we'll send the figures over.",
};

export default function PayoffRequestPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Request a payoff."
        blurb="Selling or refinancing? Tell us the closing date and who's handling title, and we'll send payoff figures straight to your escrow officer."
      />
      <section className="section bg-cream-light">
        <div className="container-x">
          <RequestForm schema={PAYOFF_REQUEST} />
        </div>
      </section>
    </>
  );
}

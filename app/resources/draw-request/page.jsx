import RequestForm from "@/components/RequestForm";
import PageHeader from "@/components/PageHeader";
import { DRAW_REQUEST } from "@/lib/requestForms";

export const metadata = {
  title: "Draw Request — Lazy Dog Capital",
  description:
    "Request a rehab draw on an active Lazy Dog Capital loan. Tell us what's finished, we verify the work, and the money releases.",
};

export default function DrawRequestPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Request a draw."
        blurb="Finished a stage of work? Tell us what's done and how to get in. We'll verify it and release the money — up to five draws across the project."
      />
      <section className="section bg-cream-light">
        <div className="container-x">
          <RequestForm schema={DRAW_REQUEST} />
        </div>
      </section>
    </>
  );
}

import DrawRequestForm from "@/components/DrawRequestForm";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Draw Request",
  description:
    "Submit a construction draw request on an active Lazy Dog Capital loan. List the completed work, we inspect and verify it, and the funds release.",
};

export default function DrawRequestPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Construction draw request."
        blurb="List the work that's complete and in place, tell us how the inspector gets in, and we'll verify it. Funds release once the work is inspected."
      />
      <section className="section bg-cream-light">
        <div className="container-x">
          <DrawRequestForm />
        </div>
      </section>
    </>
  );
}

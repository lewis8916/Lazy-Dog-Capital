import DrawRequestForm from "@/components/DrawRequestForm";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Draw Request",
  description:
    "Submit a construction draw request on an active Lazy Dog Capital loan. List the work you've completed and paid for, we inspect it in person, and we reimburse you.",
};

export default function DrawRequestPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Construction draw request."
        blurb="List the work you've completed and paid for, tell us how the inspector gets in, and we'll come look at it. Once we've seen it in person, we reimburse you."
      />
      <section className="section bg-cream-light">
        <div className="container-x">
          <DrawRequestForm />
        </div>
      </section>
    </>
  );
}

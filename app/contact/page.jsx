import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Contact Us",
  description:
    "Questions about a deal, a loan in progress, or how we lend? Call 214-740-4989 or send us a note — a real person will get back to you.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Talk to a real person."
        blurb="Questions about a deal, a loan already in progress, or how any of this works — send a note or just call. We'd rather have a ten-minute conversation than trade emails for a week."
      />
      <section className="section bg-cream-light">
        <div className="container-x">
          <ContactForm />
        </div>
      </section>
    </>
  );
}

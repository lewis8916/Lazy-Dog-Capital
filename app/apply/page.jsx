import ApplicationForm from "@/components/ApplicationForm";

export const metadata = {
  title: "Apply — Lazy Dog Capital",
  description:
    "Tell us about your deal — address, price, rehab budget, and ARV. We'll review it and reach out to walk through the numbers. No obligation.",
};

export default function ApplyPage() {
  return <ApplicationForm standalone />;
}

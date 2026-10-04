import { Accordion } from "@/components/ui/Accordion";

export const metadata = { title: "FAQ" };

const FAQS = [
  {
    question: "How long does shipping take?",
    answer: "Orders ship within 1-2 business days. Standard delivery takes 3-7 business days depending on your location.",
  },
  {
    question: "What is your return policy?",
    answer: "Unworn items with tags attached can be returned within 30 days of delivery for a full refund. Start a return from your order details page.",
  },
  {
    question: "Do you ship internationally?",
    answer: "We currently ship within the United States. International shipping is on our roadmap.",
  },
  {
    question: "How do I become a seller on ShopSphere?",
    answer: "Register for a seller account and your store will be reviewed by our team. Once approved, you can start listing products, which are also reviewed before going live.",
  },
  {
    question: "How do I track my order?",
    answer: "Order status updates — including shipping and delivery — are visible on the order details page in your account.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We support major credit and debit cards through our secure payment provider.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-widest text-muted">Support</p>
      <h1 className="mt-3 font-serif text-4xl text-foreground">Frequently Asked Questions</h1>
      <div className="mt-10">
        <Accordion items={FAQS} />
      </div>
    </div>
  );
}

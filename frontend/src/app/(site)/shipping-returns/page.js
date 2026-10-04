export const metadata = { title: "Shipping & Returns" };

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-widest text-muted">Policies</p>
      <h1 className="mt-3 font-serif text-4xl text-foreground">Shipping & Returns</h1>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-foreground">Shipping</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted">
          <p>Orders are processed and ship within 1-2 business days from the seller&apos;s location.</p>
          <p>Standard delivery takes 3-7 business days. Shipping is free on orders over $150; otherwise a flat rate of $9.99 applies.</p>
          <p>You&apos;ll receive an email as soon as your order ships, and you can track its status from your account at any time.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-foreground">Returns</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted">
          <p>We accept returns within 30 days of delivery for unworn items with tags still attached.</p>
          <p>To start a return, open the relevant order from your account and select &ldquo;Request a Return.&rdquo; Our team will follow up by email with next steps.</p>
          <p>Refunds are issued to your original payment method once the returned item is received and inspected.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-foreground">Order Cancellations</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Orders can be cancelled from your account while they are still pending payment, paid, or being
          processed. Once an order has shipped, it can no longer be cancelled — please start a return instead.
        </p>
      </section>
    </div>
  );
}

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-widest text-muted">Legal</p>
      <h1 className="mt-3 font-serif text-4xl text-foreground">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted">This is a demo application built for portfolio purposes.</p>

      <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-muted">
        <div>
          <h2 className="font-serif text-lg text-foreground">Using ShopSphere</h2>
          <p className="mt-2">
            By creating an account, you agree to provide accurate information and to use ShopSphere only for
            lawful purposes.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-lg text-foreground">Sellers</h2>
          <p className="mt-2">
            Sellers are responsible for the accuracy of their product listings and for fulfilling orders in a
            timely manner. ShopSphere reviews stores and products before they go live, and may suspend a
            store or reject a product that does not meet our standards.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-lg text-foreground">Orders & Payments</h2>
          <p className="mt-2">
            All orders are subject to product availability. Prices are shown in USD and include any
            applicable discounts at the time of purchase.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-lg text-foreground">Limitation of Liability</h2>
          <p className="mt-2">
            ShopSphere is provided &ldquo;as is&rdquo; without warranties of any kind. This demo application is
            not intended for processing real transactions.
          </p>
        </div>
      </div>
    </div>
  );
}

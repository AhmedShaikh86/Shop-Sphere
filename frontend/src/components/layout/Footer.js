import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "Shop",
    links: [
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Best Sellers", href: "/shop" },
      { label: "Sale", href: "/shop?on_sale=true" },
      { label: "All Collections", href: "/collection" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About ShopSphere", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-xl text-foreground">
              SHOPSPHERE
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">Style, curated for you.</p>
          </div>

          {FOOTER_LINKS.map((section) => (
            <div key={section.heading}>
              <p className="text-xs uppercase tracking-wide text-muted">{section.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="focus-ring text-sm text-foreground hover:text-muted">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
          <p>A demo fashion marketplace built for portfolio purposes.</p>
        </div>
      </div>
    </footer>
  );
}

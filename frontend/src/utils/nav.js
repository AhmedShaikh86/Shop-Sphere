/**
 * Finds which nav item a pathname belongs to, e.g. "/account/orders/5"
 * should match "/account/orders", not "/account" — matching by longest
 * href first avoids an index route ("/account") swallowing every nested
 * route just because they all start with it.
 */
export function findActiveNavItem(navItems, pathname) {
  return [...navItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-widest text-muted">Legal</p>
      <h1 className="mt-3 font-serif text-4xl text-foreground">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">This is a demo application built for portfolio purposes. No real personal data should be submitted.</p>

      <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-muted">
        <div>
          <h2 className="font-serif text-lg text-foreground">Information We Collect</h2>
          <p className="mt-2">
            We collect the information you provide when creating an account, placing an order, or contacting
            support — including your name, email, shipping addresses, and order history.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-lg text-foreground">How We Use Your Information</h2>
          <p className="mt-2">
            Your information is used to process orders, provide customer support, and send order-related
            notifications. We do not sell your personal information to third parties.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-lg text-foreground">Payment Information</h2>
          <p className="mt-2">
            Payments are processed through our payment provider. ShopSphere does not store your full card
            details on its own servers.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-lg text-foreground">Your Choices</h2>
          <p className="mt-2">
            You can review and update your personal details at any time from your account settings, or
            request that your account be deleted by contacting support.
          </p>
        </div>
      </div>
    </div>
  );
}

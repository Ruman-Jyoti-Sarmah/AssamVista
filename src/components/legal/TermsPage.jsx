export default function TermsPage() {
  return (
    <section className="legal-page" id="top">
      <div className="legal-wrap">
        <span className="label">Legal</span>
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: 2026-11-15</p>

        <p>
          These terms govern your use of AssamVista's website features, including browsing, account creation,
          authenticated checkout requests, and trip plan submissions.
        </p>

        <h2>Using the site</h2>
        <ul>
          <li>You may browse cultural and travel content without an account.</li>
          <li>An account is required to proceed to checkout and to submit a completed trip plan.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials and for activity under your account.</li>
        </ul>

        <h2>Accounts</h2>
        <ul>
          <li>Provide accurate information when creating an account.</li>
          <li>Do not attempt to access other users' accounts, orders, or trip plans.</li>
          <li>We may suspend or restrict access in cases of abuse, fraud, or security risk, as permitted by applicable law and operational needs.</li>
        </ul>

        <h2>Orders and checkout</h2>
        <ul>
          <li>Marketplace checkout in this implementation creates an authenticated order/request record with server-verified product and pricing information.</li>
          <li>Unless explicitly stated and integrated, real-time payment processing, shipping fulfillment, seller confirmation, refunds, or delivery guarantees are not provided by this website alone.</li>
          <li>Product availability, pricing, and fulfillment depend on the actual seller/operator arrangements.</li>
        </ul>

        <h2>Trip plans</h2>
        <ul>
          <li>Trip plans and itineraries are planning tools and estimates unless explicitly confirmed by a provider.</li>
          <li>Submitting a trip plan does not itself guarantee bookings, reservations, availability, pricing, or travel services.</li>
        </ul>

        <h2>Acceptable use</h2>
        <ul>
          <li>Do not misuse forms, attempt unauthorized access, scrape or disrupt services, or submit unlawful content.</li>
          <li>Do not use the service to store or transmit malicious code or violate others' rights.</li>
        </ul>

        <h2>Privacy</h2>
        <p>Your use of the site is also subject to the <a href="#/privacy">Privacy Policy</a>.</p>

        <h2>Changes and availability</h2>
        <p>
          Features, content, and availability may change. We may update these terms; continued use after updates
          constitutes acceptance of the revised terms where applicable.
        </p>

        <h2>Operator information</h2>
        <p>
          Verified legal entity, jurisdiction, and contact details should be provided by the site operator before
          production deployment. This codebase does not invent those details.
        </p>
      </div>
    </section>
  );
}

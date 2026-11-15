export default function PrivacyPage() {
  return (
    <section className="legal-page" id="top">
      <div className="legal-wrap">
        <span className="label">Legal</span>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: 2026-11-15</p>

        <p>
          AssamVista is an informational and planning website for exploring Assam and, where available, submitting
          trip plans or placing marketplace checkout requests. This policy explains what data this implementation
          collects, how it is used, and the choices available to you.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li><strong>Account data:</strong> name, email address, and a server-side password hash when you create an account.</li>
          <li><strong>Authentication/session data:</strong> session identifiers, session expiry metadata, and CSRF/session cookies needed to keep you signed in and protect account actions.</li>
          <li><strong>Order data:</strong> selected products, quantities, verified server-side prices/totals, shipping/contact details you provide at checkout, and order status metadata.</li>
          <li><strong>Trip plan data:</strong> destinations, travel dates, traveller counts, preferences, notes, and generated itinerary details you submit.</li>
          <li><strong>Local browser data:</strong> preferences, cart, wishlist, and trip-planning progress may be stored in your browser (localStorage/sessionStorage) so you can continue browsing and resume gated actions.</li>
          <li><strong>Bookings/newsletter (where used):</strong> information you submit through existing public forms such as visit booking or newsletter signup.</li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>To create and authenticate accounts and protect account actions.</li>
          <li>To process authenticated checkout requests and trip plan submissions.</li>
          <li>To show your orders and trip plans in your account.</li>
          <li>To preserve intended actions (checkout/trip submission) across login or signup.</li>
          <li>To maintain security, prevent abuse, and troubleshoot service issues.</li>
        </ul>

        <h2>Authentication and security</h2>
        <p>
          Passwords are not stored in plaintext; this implementation stores server-side password hashes. Authenticated
          sessions use HttpOnly cookies and CSRF protection for state-changing requests. Access to sensitive account,
          order, and trip-plan operations is enforced on the server.
        </p>

        <h2>Cookies and browser storage</h2>
        <ul>
          <li><strong>Session cookies:</strong> used to identify an authenticated session.</li>
          <li><strong>CSRF cookie/token:</strong> used to help protect authenticated form/API actions.</li>
          <li><strong>localStorage/sessionStorage:</strong> used for preferences, cart/trip progress, and pending auth actions.</li>
        </ul>

        <h2>Data storage</h2>
        <p>
          Application data is stored in the project's server-side JSON data store in this deployment architecture.
          You should review hosting, backup, and access controls in your deployment environment for production use.
        </p>

        <h2>Your rights and choices</h2>
        <ul>
          <li>You may browse most content without creating an account.</li>
          <li>You can log out to end your current session on this device.</li>
          <li>You can request account deletion from the account settings area, which removes account/session data and associated stored records as implemented by this application.</li>
          <li>You can clear browser-stored cart/trip/preferences by clearing site data in your browser.</li>
        </ul>

        <h2>India-specific notice</h2>
        <p>
          If you use AssamVista from India, your personal data is handled in accordance with applicable Indian data
          protection requirements to the extent relevant to this service. For specific legal requests, contact the
          site operator using verified contact details provided by the operator.
        </p>

        <h2>Contact and operator details</h2>
        <p>
          Verified legal entity, contact, and grievance/contact details are not embedded in this codebase placeholder.
          The site operator should publish accurate contact information before production use.
        </p>
      </div>
    </section>
  );
}

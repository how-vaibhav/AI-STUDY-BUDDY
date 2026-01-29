export default function CookiesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
      <p className="text-muted-foreground mb-6">
        We use cookies and similar technologies to provide and improve our
        services. This page explains the types of cookies we use and how to
        manage them.
      </p>

      <section className="space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="font-semibold text-lg">Essential Cookies</h2>
          <p className="mt-2">
            Required for core functionality such as authentication and security.
            These cookies cannot be turned off for the service to work.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">Performance & Analytics</h2>
          <p className="mt-2">
            We may collect anonymous metrics to understand feature usage and
            improve the product. These are aggregated and do not identify you
            personally.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">Advertising & Third Parties</h2>
          <p className="mt-2">
            We do not use cookies to sell personal data. Where third-party
            services are used (analytics providers), their cookies may be set
            according to their policies.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">Managing Cookies</h2>
          <p className="mt-2">
            You can manage cookie preferences from your browser settings or via
            available privacy controls. Disabling certain cookies may reduce
            functionality.
          </p>
        </div>
      </section>
    </main>
  );
}

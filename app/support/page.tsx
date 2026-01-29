import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Support</h1>
      <p className="text-muted-foreground mb-6">
        Need help? Use the resources below or contact our support team.
      </p>

      <section className="space-y-6 text-sm text-muted-foreground">
        <div>
          <h2 className="font-semibold">Frequently Asked Questions</h2>
          <dl className="mt-3 space-y-3">
            <div>
              <dt className="font-medium">How do I reset my password?</dt>
              <dd className="mt-1">
                Use the "Forgot password" link on the login page. If you still
                face issues, contact support.
              </dd>
            </div>

            <div>
              <dt className="font-medium">How do I delete my account?</dt>
              <dd className="mt-1">
                Send a request to{" "}
                <a
                  href="mailto:support@aistudybuddy.com"
                  className="text-indigo-600 hover:underline"
                >
                  support@aistudybuddy.com
                </a>{" "}
                with the subject "Delete account".
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="font-semibold">Contact Support</h2>
          <p className="mt-2">
            Email:{" "}
            <a
              href="mailto:support@aistudybuddy.com"
              className="text-indigo-600 hover:underline"
            >
              support@aistudybuddy.com
            </a>
          </p>
          <p className="mt-2">
            For urgent issues, include your account email, screenshots, and a
            brief description so we can help faster.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Self-help</h2>
          <p className="mt-2">
            Browse the{" "}
            <Link href="/blog" className="text-indigo-600 hover:underline">
              Blog
            </Link>{" "}
            for tips, the{" "}
            <Link href="/about" className="text-indigo-600 hover:underline">
              About
            </Link>{" "}
            page for product info, or check our{" "}
            <a href="#faqs" className="text-indigo-600 hover:underline">
              FAQ
            </a>{" "}
            below.
          </p>
          <div id="faqs" className="mt-4 space-y-2">
            <details className="p-3 bg-gray-50 rounded-md">
              <summary className="font-medium">
                How long until I get a response?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                Typical response time is 1–2 business days. For high-priority
                outages we respond faster.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}

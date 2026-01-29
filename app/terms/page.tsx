export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-6">
        These terms govern your use of AI Study Buddy. Please read them
        carefully.
      </p>

      <section className="space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="font-semibold text-lg">Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing or using AI Study Buddy, you agree to these Terms. If
            you do not agree, please do not use the service.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">
            Accounts and Responsibilities
          </h2>
          <p className="mt-2">
            You are responsible for keeping your account secure and for all
            activity that occurs under your account. Notify us of any
            unauthorized access.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">Content and IP</h2>
          <p className="mt-2">
            All content provided by AI Study Buddy, including generated study
            plans and articles, is owned by us or our licensors. You may use
            content for personal, non-commercial use only unless otherwise
            permitted.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">Limitation of Liability</h2>
          <p className="mt-2">
            We provide guidance and tools to support learning. We do not
            guarantee exam results. To the fullest extent permitted by law, our
            liability is limited.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">Contact</h2>
          <p className="mt-2">
            Questions about these terms:{" "}
            <a
              href="mailto:legal@aistudybuddy.com"
              className="text-indigo-600 hover:underline"
            >
              legal@aistudybuddy.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

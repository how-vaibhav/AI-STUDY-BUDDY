export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-6">
        We value your privacy. This page explains what information we collect,
        how we use it, and the controls you have.
      </p>

      <section className="space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="font-semibold text-lg">Information We Collect</h2>
          <ul className="list-disc list-inside mt-3">
            <li>Account details: name, email (for account, notifications).</li>
            <li>Profile preferences: subjects, exam type, study goals.</li>
            <li>
              Usage data: feature usage and anonymized analytics to improve
              recommendations.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg">How We Use Your Data</h2>
          <p className="mt-2">
            We use data to personalize study plans, tailor quizzes, suggest
            relevant content, and improve the product. Personal data is not sold
            to third parties.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">Data Retention & Security</h2>
          <p className="mt-2">
            We retain data only as long as necessary and employ
            industry-standard measures (encryption in transit and at rest,
            access controls) to protect information.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">Your Choices</h2>
          <p className="mt-2">
            You can request export or deletion of your personal data by
            contacting us. You can also manage notification settings from your
            profile.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">Contact</h2>
          <p className="mt-2">
            For privacy requests or questions, email{" "}
            <a
              href="mailto:privacy@aistudybuddy.com"
              className="text-indigo-600 hover:underline"
            >
              privacy@aistudybuddy.com
            </a>
            . We aim to respond within 5 business days.
          </p>
        </div>
      </section>
    </main>
  );
}

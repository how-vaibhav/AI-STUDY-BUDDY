import Link from "next/link";

export default function CareersPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Careers at AI Study Buddy</h1>
      <p className="text-muted-foreground mb-6">
        We're building AI-first learning tools for Indian students. If you're
        passionate about education, AI, or product design, we'd love to hear
        from you.
      </p>

      <section className="space-y-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Open Roles</h2>
          <ul className="mt-3 list-disc list-inside text-sm text-muted-foreground">
            <li>Full-stack Engineer (Next.js, TypeScript)</li>
            <li>Machine Learning Engineer (NLP/Recommendations)</li>
            <li>Product Designer (EdTech focus)</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Why join us?</h2>
          <ul className="mt-3 list-disc list-inside text-sm text-muted-foreground">
            <li>Meaningful impact in Indian education at scale.</li>
            <li>Flexible work and focus on learning culture.</li>
            <li>Competitive compensation and learning budget.</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">How to Apply</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Send your resume and a brief note about what you build and why to{" "}
            <a
              href="mailto:careers@aistudybuddy.com"
              className="text-indigo-600 hover:underline"
            >
              careers@aistudybuddy.com
            </a>
            . Include links to your portfolio or GitHub if applicable.
          </p>
        </div>
      </section>

      <div className="mt-8">
        <Link href="/about" className="text-indigo-600 hover:underline">
          Learn more about our mission →
        </Link>
      </div>
    </main>
  );
}

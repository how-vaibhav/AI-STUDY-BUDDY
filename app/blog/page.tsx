import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">AI Study Buddy Blog</h1>
      <p className="text-muted-foreground mb-6">
        Insights, study tips, and product updates to help you learn smarter. We
        publish concise, actionable articles focused on study techniques, exam
        strategies, and new AI features in the app.
      </p>

      <section className="grid gap-6">
        <article className="p-6 rounded-lg border hover:shadow-md transition">
          <h2 className="text-xl font-semibold">
            How to Build a Weekly Study Rhythm
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Learn a simple, repeatable routine to structure each week for deep
            focus and steady progress. Includes a sample schedule for board and
            competitive exam prep.
          </p>
          <div className="mt-4">
            <Link
              href="/blog/study-rhythm"
              className="text-indigo-600 hover:underline"
            >
              Read more →
            </Link>
          </div>
        </article>

        <article className="p-6 rounded-lg border hover:shadow-md transition">
          <h2 className="text-xl font-semibold">
            Using AI to Summarize Notes Effectively
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Practical tips to convert class notes into review-ready summaries
            and flashcards using our Notes Summarizer feature.
          </p>
          <div className="mt-4">
            <Link
              href="/blog/summarize-notes"
              className="text-indigo-600 hover:underline"
            >
              Read more →
            </Link>
          </div>
        </article>
      </section>

      <div className="mt-10 border-t pt-8 text-sm text-muted-foreground">
        <p>
          Want to contribute or suggest a topic? Reach out via our{" "}
          <Link href="/contact" className="text-indigo-600 hover:underline">
            Contact
          </Link>{" "}
          page.
        </p>
      </div>
    </main>
  );
}

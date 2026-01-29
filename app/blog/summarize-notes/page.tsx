import Link from "next/link";

export default function SummarizeNotesArticle() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-sm text-indigo-600 hover:underline">
        ← Back to Blog
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-4">
        Using AI to Summarize Notes Effectively
      </h1>
      <p className="text-muted-foreground mb-6">
        Turn long lecture notes into concise study-ready summaries and
        flashcards.
      </p>

      <article className="prose dark:prose-invert max-w-none">
        <h2>Step 1: Capture clear notes</h2>
        <p>
          Write down headings, formulas, and key examples. Short bullets work
          best for automated summarization.
        </p>

        <h2>Step 2: Organize by topic</h2>
        <p>
          Group related points together — this helps AI produce focused
          summaries and generate flashcards per topic.
        </p>

        <h2>Step 3: Use the Notes Summarizer</h2>
        <p>
          Paste your notes into the Notes Summarizer and pick an output format:
          short summary, long summary, or flashcards.
        </p>

        <h2>Step 4: Iterate</h2>
        <p>
          Refine the summary by asking follow-ups: "Explain this concept in 2
          sentences" or "Give 5 practice questions".
        </p>

        <h2>Best Practices</h2>
        <ul>
          <li>Prefer clear bullets over long paragraphs</li>
          <li>Mark formulas and examples explicitly</li>
          <li>Use the flashcard export for quick revisions</li>
        </ul>
      </article>
    </main>
  );
}

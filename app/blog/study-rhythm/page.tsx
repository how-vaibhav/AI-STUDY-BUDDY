import Link from "next/link";

export default function StudyRhythmArticle() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-sm text-indigo-600 hover:underline">
        ← Back to Blog
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-4">
        How to Build a Weekly Study Rhythm
      </h1>
      <p className="text-muted-foreground mb-6">
        A practical, repeatable plan to make every week productive and
        stress-minimized.
      </p>

      <article className="prose dark:prose-invert max-w-none">
        <h2>1. Define weekly goals</h2>
        <p>
          Start with 2–3 concrete goals each week (topic coverage, problem sets,
          revision). Keep them specific and measurable.
        </p>

        <h2>2. Time-block your days</h2>
        <p>
          Divide your day into focused study blocks and refresh buffers.
          Example: morning theory, afternoon problems, evening revision.
        </p>

        <h2>3. Build revision into the plan</h2>
        <p>
          Use spaced repetition: schedule short reviews 1, 3, and 7 days after
          first study.
        </p>

        <h2>4. Weekly review</h2>
        <p>
          At the end of the week, grade progress, adjust next week's goals, and
          carry forward unfinished items.
        </p>

        <h2>5. Sample week</h2>
        <ul>
          <li>Mon: Core concept learning (3 hrs)</li>
          <li>Tue: Problem-solving (3 hrs)</li>
          <li>Wed: Mixed practice + quick revision (2.5 hrs)</li>
          <li>Thu: New topic deep dive (3 hrs)</li>
          <li>Fri: Mock test / timed practice (2 hrs)</li>
          <li>Sat: Review & weak topic focus (3 hrs)</li>
          <li>Sun: Light revision + rest</li>
        </ul>

        <h2>Closing tips</h2>
        <p>
          Be realistic about daily hours, rest properly, and iterate on your
          plan based on what works. Use AI Study Buddy to generate and adapt
          plans automatically.
        </p>
      </article>
    </main>
  );
}

import { solveDubt } from '@/lib/groq-client';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
	try {
		const supabase = await createClient();

		const body = await request.json();
		const question = body.question || '';
		const subject = body.subject || 'General';
		const answerType = body.answerType || 'Medium';
		const fileContext = body.fileContext || null;

		if (!question || question.trim().length === 0) {
			return Response.json({ error: 'Question is required' }, { status: 400 });
		}

		const answer = await solveDubt(question, subject, answerType, fileContext);

		const { error: insertError } = await supabase
			.from('Doubts')
			.insert({ question: question, answer: answer });

		if (insertError)
			return Response.json({ error: insertError.message }, { status: 400 });

		return Response.json({ success: true, answer });
	} catch (error) {
		console.error('[solve-doubt] Error:', error);
		const msg = error instanceof Error ? error.message : String(error);
		return Response.json({ error: msg }, { status: 500 });
	}
}

export const GET = async () => {
	try {
		const supabase = await createClient();

		const { data: Doubts, error } = await supabase
			.from('Doubts')
			.select('doubt_id, question, answer');

		return Response.json({ success: true, Doubts });
	} catch (error) {
		console.error(error);
		return Response.json({ error: error }, { status: 500 });
	}
};

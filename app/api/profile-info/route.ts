import { createClient } from '@/utils/supabase/server';

export const POST = async (request: Request) => {
	try {
		const body = await request.json();

		const supabase = await createClient();

		const { fullName, targetExam, currentClass, strengths, weaknesses } = body;

		const { data, error } = await supabase
			.from('profile')
			.insert({
				name: fullName,
				target: targetExam,
				class: currentClass,
				strengths: strengths,
				weakness: weaknesses,
			})
			.select()
			.single();

		if (error)
			return Response.json(
				{
					success: true,
					error: error.message || 'An unexpected error occurred!',
				},
				{ status: 500 },
			);

		return Response.json({ success: true, data });
	} catch (error: any) {
		return Response.json(
			{ success: false, error: error.message || 'Internal Server Error' },
			{ status: 500 },
		);
	}
};

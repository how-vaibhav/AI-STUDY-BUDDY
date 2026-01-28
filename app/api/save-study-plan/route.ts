import { createClient } from '@/utils/supabase/server';

export const POST = async (request: Request) => {
	try {
		const supabase = await createClient();
		const body = await request.json();
		const { generalInfo, dailyRoutines, title } = body;

		const structuredRoutine = dailyRoutines.map(
			(content: string, index: number) => {
				const header = content.split('\n')[0].trim();

				return {
					day_number: index + 1,
					title: header,
					content: content,
					is_completed: false,
					completed_at: null,
				};
			},
		);

		const { data: PlanData, error: PlanError } = await supabase
			.from('studyPlans')
			.insert({
				info: generalInfo,
				daily_routines: structuredRoutine,
				title: title,
			});

		if (PlanError)
			return Response.json(
				{ error: PlanError.message, success: false },
				{ status: 500 },
			);

		return Response.json({ success: true });
	} catch (error) {
		return Response.json(
			{ error: 'Failed to save plan.', success: false },
			{ status: 500 },
		);
	}
};

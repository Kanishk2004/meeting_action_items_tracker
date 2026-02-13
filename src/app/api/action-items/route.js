import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import ActionItem from '@/models/actionItems';

/**
 * GET /api/action-items
 * List action items. Optionally filter by transcriptId via query param.
 * Example: /api/action-items?transcriptId=abc123
 */
export async function GET(request) {
	try {
		await connect();

		const { searchParams } = new URL(request.url);
		const transcriptId = searchParams.get('transcriptId');

		const filter = {};
		if (transcriptId) {
			filter.transcriptId = transcriptId;
		}

		const actionItems = await ActionItem.find(filter)
			.sort({ _id: -1 })
			.lean();

		return NextResponse.json(actionItems, { status: 200 });
	} catch (error) {
		console.error('Error in GET /api/action-items:', error);
		return NextResponse.json(
			{ error: 'Internal server error.' },
			{ status: 500 },
		);
	}
}

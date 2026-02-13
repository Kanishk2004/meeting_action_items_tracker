import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Transcript from '@/models/transcript';
import ActionItem from '@/models/actionItems';

/**
 * GET /api/transcripts
 * Returns the last 5 processed transcripts along with their action items.
 */
export async function GET() {
	try {
		await connect();

		const transcripts = await Transcript.find()
			.sort({ createdAt: -1 })
			.limit(5)
			.lean();

		// Fetch action items for each transcript
		const transcriptIds = transcripts.map((t) => t._id);
		const actionItems = await ActionItem.find({
			transcriptId: { $in: transcriptIds },
		}).lean();

		// Group action items by transcriptId
		const itemsByTranscript = {};
		for (const item of actionItems) {
			const key = item.transcriptId.toString();
			if (!itemsByTranscript[key]) {
				itemsByTranscript[key] = [];
			}
			itemsByTranscript[key].push(item);
		}

		// Attach action items to their transcript
		const result = transcripts.map((t) => ({
			...t,
			actionItems: itemsByTranscript[t._id.toString()] || [],
		}));

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error('Error in GET /api/transcripts:', error);
		return NextResponse.json(
			{ error: 'Internal server error.' },
			{ status: 500 },
		);
	}
}

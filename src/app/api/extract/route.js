import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Transcript from '@/models/transcript';
import ActionItem from '@/models/actionItems';
import { extractActionItems } from '@/lib/ai';

/**
 * POST /api/extract
 * Accepts a meeting transcript, saves it, extracts action items via OpenAI,
 * stores the action items, and returns everything.
 *
 * Body: { "transcript": "..." }
 */
export async function POST(request) {
	try {
		const body = await request.json();
		const { transcript } = body;

		if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
			return NextResponse.json(
				{ error: 'A non-empty "transcript" string is required.' },
				{ status: 400 },
			);
		}

		await connect();

		// 1. Save the raw transcript
		const savedTranscript = await Transcript.create({
			rawText: transcript.trim(),
		});

		// 2. Extract action items using OpenAI
		let extractedItems;
		try {
			extractedItems = await extractActionItems(transcript.trim());
		} catch (aiError) {
			// If AI extraction fails, still keep the transcript but return error
			return NextResponse.json(
				{
					error: 'Failed to extract action items from the transcript.',
					transcriptId: savedTranscript._id,
					details: aiError.message,
				},
				{ status: 502 },
			);
		}

		// 3. Store extracted action items in MongoDB
		const actionItems = await ActionItem.insertMany(
			extractedItems.map((item) => ({
				transcriptId: savedTranscript._id,
				task: item.task,
				owner: item.owner || null,
				dueDate: item.dueDate ? new Date(item.dueDate) : null,
				status: 'pending',
			})),
		);

		// 4. Return transcript + action items
		return NextResponse.json(
			{
				transcript: savedTranscript,
				actionItems,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error in POST /api/extract:', error);
		return NextResponse.json(
			{ error: 'Internal server error.' },
			{ status: 500 },
		);
	}
}

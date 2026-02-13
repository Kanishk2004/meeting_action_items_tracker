import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/db';
import Transcript from '@/models/transcript';
import ActionItem from '@/models/actionItems';

/**
 * GET /api/transcripts/[id]
 * Returns a single transcript by ID along with its action items.
 */
export async function GET(request, { params }) {
	try {
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: 'Invalid transcript ID.' },
				{ status: 400 },
			);
		}

		await connect();

		const transcript = await Transcript.findById(id).lean();

		if (!transcript) {
			return NextResponse.json(
				{ error: 'Transcript not found.' },
				{ status: 404 },
			);
		}

		const actionItems = await ActionItem.find({ transcriptId: id }).lean();

		return NextResponse.json(
			{ ...transcript, actionItems },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error in GET /api/transcripts/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error.' },
			{ status: 500 },
		);
	}
}

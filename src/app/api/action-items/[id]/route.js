import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/db';
import ActionItem from '@/models/actionItems';

/**
 * PUT /api/action-items/[id]
 * Update an action item (task, owner, dueDate, status).
 * Body can include any subset of: { task, owner, dueDate, status }
 */
export async function PUT(request, { params }) {
	try {
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: 'Invalid action item ID.' },
				{ status: 400 },
			);
		}

		const body = await request.json();
		const allowedFields = ['task', 'owner', 'dueDate', 'status'];
		const updates = {};

		for (const field of allowedFields) {
			if (field in body) {
				if (field === 'dueDate') {
					updates[field] = body[field] ? new Date(body[field]) : null;
				} else {
					updates[field] = body[field];
				}
			}
		}

		if (Object.keys(updates).length === 0) {
			return NextResponse.json(
				{ error: 'No valid fields to update.' },
				{ status: 400 },
			);
		}

		await connect();

		const updated = await ActionItem.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		}).lean();

		if (!updated) {
			return NextResponse.json(
				{ error: 'Action item not found.' },
				{ status: 404 },
			);
		}

		return NextResponse.json(updated, { status: 200 });
	} catch (error) {
		console.error('Error in PUT /api/action-items/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error.' },
			{ status: 500 },
		);
	}
}

/**
 * DELETE /api/action-items/[id]
 * Delete an action item by ID.
 */
export async function DELETE(request, { params }) {
	try {
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: 'Invalid action item ID.' },
				{ status: 400 },
			);
		}

		await connect();

		const deleted = await ActionItem.findByIdAndDelete(id).lean();

		if (!deleted) {
			return NextResponse.json(
				{ error: 'Action item not found.' },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ message: 'Action item deleted successfully.' },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error in DELETE /api/action-items/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error.' },
			{ status: 500 },
		);
	}
}

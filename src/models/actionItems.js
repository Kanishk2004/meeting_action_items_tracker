import mongoose from 'mongoose';

const ActionItemSchema = new mongoose.Schema({
	transcriptId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Transcript',
		required: true,
	},
	task: {
		type: String,
		required: true,
	},
	owner: {
		type: String,
		default: null,
	},
	dueDate: {
		type: Date,
		default: null,
	},
	status: {
		type: String,
		enum: ['pending', 'done'],
		default: 'pending',
	},
});

export default mongoose.models.ActionItem ||
	mongoose.model('ActionItem', ActionItemSchema);

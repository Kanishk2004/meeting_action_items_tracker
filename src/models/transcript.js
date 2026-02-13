import mongoose from 'mongoose';

const transcriptSchema = new mongoose.Schema(
	{
		rawText: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

export default mongoose.models.Transcript ||
	mongoose.model('Transcript', transcriptSchema);

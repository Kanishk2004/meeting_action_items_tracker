import Link from 'next/link';

export default function TranscriptCard({ transcript }) {
	const date = new Date(transcript.createdAt).toLocaleString();
	const preview =
		transcript.rawText.length > 150
			? transcript.rawText.slice(0, 150) + '...'
			: transcript.rawText;

	const totalItems = transcript.actionItems?.length || 0;
	const doneItems = transcript.actionItems?.filter((i) => i.status === 'done').length || 0;

	return (
		<Link
			href={`/transcript/${transcript._id}`}
			className="block rounded-lg border border-border bg-surface-light p-5 transition-all hover:border-orange-accent/50 hover:bg-surface-lighter"
		>
			<div className="mb-3 flex items-center justify-between">
				<span className="text-xs text-text-secondary">{date}</span>
				<span className="rounded-full bg-orange-dim px-2.5 py-0.5 text-xs font-medium text-orange-accent">
					{doneItems}/{totalItems} done
				</span>
			</div>
			<p className="text-sm leading-relaxed text-text-secondary line-clamp-3">
				{preview}
			</p>
		</Link>
	);
}

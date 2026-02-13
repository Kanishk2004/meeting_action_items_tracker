'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ActionItemCard from '@/components/ActionItemCard';
import Loader from '@/components/Loader';
import Link from 'next/link';

export default function TranscriptDetailPage() {
	const { id } = useParams();
	const [transcript, setTranscript] = useState(null);
	const [actionItems, setActionItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchTranscript = async () => {
			try {
				const res = await fetch(`/api/transcripts/${id}`);
				if (!res.ok) throw new Error('Failed to fetch');
				const data = await res.json();
				setTranscript(data);
				setActionItems(data.actionItems || []);
			} catch {
				setError('Failed to load transcript.');
			} finally {
				setLoading(false);
			}
		};
		fetchTranscript();
	}, [id]);

	const handleUpdate = (updated) => {
		setActionItems((prev) =>
			prev.map((item) => (item._id === updated._id ? updated : item)),
		);
	};

	const handleDelete = (deletedId) => {
		setActionItems((prev) => prev.filter((item) => item._id !== deletedId));
	};

	if (loading) return <Loader text="Loading transcript..." />;

	if (error) {
		return (
			<div className="space-y-4">
				<p className="text-red-400">{error}</p>
				<Link href="/history" className="text-sm text-orange-accent hover:text-orange-hover">
					← Back to history
				</Link>
			</div>
		);
	}

	const doneCount = actionItems.filter((i) => i.status === 'done').length;

	return (
		<div className="space-y-8">
			{/* Back link */}
			<Link
				href="/history"
				className="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-orange-accent"
			>
				← Back to history
			</Link>

			{/* Transcript Info */}
			<div>
				<div className="mb-2 flex items-center gap-3">
					<h1 className="text-2xl font-bold tracking-tight">
						Transcript <span className="text-orange-accent">Details</span>
					</h1>
					<span className="rounded-full bg-orange-dim px-2.5 py-0.5 text-xs font-medium text-orange-accent">
						{doneCount}/{actionItems.length} done
					</span>
				</div>
				<p className="text-xs text-text-secondary">
					Processed on {new Date(transcript.createdAt).toLocaleString()}
				</p>
			</div>

			{/* Raw Transcript */}
			<div className="rounded-lg border border-border bg-surface-light p-5">
				<h2 className="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">
					Raw Transcript
				</h2>
				<p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary/80">
					{transcript.rawText}
				</p>
			</div>

			{/* Action Items */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">
					Action Items{' '}
					<span className="text-text-secondary font-normal text-sm">
						({actionItems.length})
					</span>
				</h2>

				{actionItems.length === 0 ? (
					<p className="rounded-lg border border-border bg-surface-light p-6 text-center text-sm text-text-secondary">
						No action items for this transcript.
					</p>
				) : (
					<div className="space-y-2">
						{actionItems.map((item) => (
							<ActionItemCard
								key={item._id}
								item={item}
								onUpdate={handleUpdate}
								onDelete={handleDelete}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

'use client';

import { useEffect, useState } from 'react';
import TranscriptCard from '@/components/TranscriptCard';
import Loader from '@/components/Loader';

export default function HistoryPage() {
	const [transcripts, setTranscripts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchTranscripts = async () => {
			try {
				const res = await fetch('/api/transcripts');
				if (!res.ok) throw new Error('Failed to fetch');
				const data = await res.json();
				setTranscripts(data);
			} catch {
				setError('Failed to load transcripts.');
			} finally {
				setLoading(false);
			}
		};
		fetchTranscripts();
	}, []);

	if (loading) return <Loader text="Loading transcripts..." />;

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Recent <span className="text-orange-accent">Transcripts</span>
				</h1>
				<p className="mt-2 text-text-secondary">
					Your last 5 processed meeting transcripts.
				</p>
			</div>

			{error && <p className="text-sm text-red-400">{error}</p>}

			{transcripts.length === 0 ? (
				<div className="rounded-lg border border-border bg-surface-light p-10 text-center">
					<p className="text-text-secondary">No transcripts yet. Go extract some action items!</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{transcripts.map((t) => (
						<TranscriptCard key={t._id} transcript={t} />
					))}
				</div>
			)}
		</div>
	);
}

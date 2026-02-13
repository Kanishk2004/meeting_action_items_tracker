'use client';

import { useState } from 'react';

export default function TranscriptForm({ onExtracted, isLoading, setIsLoading }) {
	const [transcript, setTranscript] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!transcript.trim()) {
			setError('Please paste a meeting transcript.');
			return;
		}

		setIsLoading(true);
		try {
			const res = await fetch('/api/extract', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ transcript: transcript.trim() }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || 'Something went wrong.');
				return;
			}

			onExtracted(data);
			setTranscript('');
		} catch {
			setError('Failed to connect to the server.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="transcript" className="mb-2 block text-sm font-medium text-text-secondary">
					Paste your meeting transcript
				</label>
				<textarea
					id="transcript"
					rows={8}
					value={transcript}
					onChange={(e) => setTranscript(e.target.value)}
					placeholder="e.g. John said we need to finish the report by Friday. Sarah will handle the client presentation next week..."
					disabled={isLoading}
					className="w-full resize-y rounded-lg border border-border bg-surface-light p-4 text-sm text-text-primary placeholder-text-secondary/50 transition-colors focus:border-orange-accent disabled:opacity-50"
				/>
			</div>

			{error && (
				<p className="text-sm text-red-400">{error}</p>
			)}

			<button
				type="submit"
				disabled={isLoading || !transcript.trim()}
				className="inline-flex items-center gap-2 rounded-lg bg-orange-accent px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-orange-hover disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isLoading ? (
					<>
						<span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
						Extracting...
					</>
				) : (
					'Extract Action Items'
				)}
			</button>
		</form>
	);
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TranscriptForm from '@/components/TranscriptForm';
import ActionItemCard from '@/components/ActionItemCard';

export default function Home() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState(null);

	const handleExtracted = (data) => {
		setResult(data);
	};

	const handleUpdate = (updated) => {
		setResult((prev) => ({
			...prev,
			actionItems: prev.actionItems.map((item) =>
				item._id === updated._id ? updated : item,
			),
		}));
	};

	const handleDelete = (id) => {
		setResult((prev) => ({
			...prev,
			actionItems: prev.actionItems.filter((item) => item._id !== id),
		}));
	};

	return (
		<div className="space-y-10">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Extract <span className="text-orange-accent">Action Items</span>
				</h1>
				<p className="mt-2 text-text-secondary">
					Paste a meeting transcript and let AI extract actionable tasks.
				</p>
			</div>

			{/* Form */}
			<TranscriptForm
				onExtracted={handleExtracted}
				isLoading={isLoading}
				setIsLoading={setIsLoading}
			/>

			{/* Results */}
			{result && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">
							Extracted Items{' '}
							<span className="text-text-secondary font-normal text-sm">
								({result.actionItems.length})
							</span>
						</h2>
						{result.transcript && (
							<button
								onClick={() =>
									router.push(`/transcript/${result.transcript._id}`)
								}
								className="text-xs text-orange-accent transition-colors hover:text-orange-hover">
								View full transcript →
							</button>
						)}
					</div>

					{result.actionItems.length === 0 ? (
						<p className="rounded-lg border border-border bg-surface-light p-6 text-center text-sm text-text-secondary">
							No action items found in this transcript.
						</p>
					) : (
						<div className="space-y-2">
							{result.actionItems.map((item) => (
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
			)}
		</div>
	);
}

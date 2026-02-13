'use client';

import { useState } from 'react';

export default function ActionItemCard({ item, onUpdate, onDelete }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editData, setEditData] = useState({
		task: item.task,
		owner: item.owner || '',
		dueDate: item.dueDate ? item.dueDate.split('T')[0] : '',
	});
	const [loading, setLoading] = useState(false);

	const isDone = item.status === 'done';

	const handleSave = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/action-items/${item._id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					task: editData.task,
					owner: editData.owner || null,
					dueDate: editData.dueDate || null,
				}),
			});
			if (res.ok) {
				const updated = await res.json();
				onUpdate(updated);
				setIsEditing(false);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleToggleDone = async () => {
		setLoading(true);
		try {
			const newStatus = isDone ? 'pending' : 'done';
			const res = await fetch(`/api/action-items/${item._id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			});
			if (res.ok) {
				const updated = await res.json();
				onUpdate(updated);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/action-items/${item._id}`, {
				method: 'DELETE',
			});
			if (res.ok) {
				onDelete(item._id);
			}
		} finally {
			setLoading(false);
		}
	};

	if (isEditing) {
		return (
			<div className="rounded-lg border border-orange-accent/40 bg-surface-light p-4 space-y-3">
				<div>
					<label className="mb-1 block text-xs text-text-secondary">Task</label>
					<input
						type="text"
						value={editData.task}
						onChange={(e) => setEditData({ ...editData, task: e.target.value })}
						className="w-full rounded border border-border bg-surface p-2 text-sm text-text-primary"
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label className="mb-1 block text-xs text-text-secondary">Owner</label>
						<input
							type="text"
							value={editData.owner}
							onChange={(e) => setEditData({ ...editData, owner: e.target.value })}
							placeholder="Unassigned"
							className="w-full rounded border border-border bg-surface p-2 text-sm text-text-primary"
						/>
					</div>
					<div>
						<label className="mb-1 block text-xs text-text-secondary">Due Date</label>
						<input
							type="date"
							value={editData.dueDate}
							onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
							className="w-full rounded border border-border bg-surface p-2 text-sm text-text-primary"
						/>
					</div>
				</div>
				<div className="flex gap-2 pt-1">
					<button
						onClick={handleSave}
						disabled={loading || !editData.task.trim()}
						className="rounded bg-orange-accent px-4 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-orange-hover disabled:opacity-50"
					>
						Save
					</button>
					<button
						onClick={() => {
							setIsEditing(false);
							setEditData({
								task: item.task,
								owner: item.owner || '',
								dueDate: item.dueDate ? item.dueDate.split('T')[0] : '',
							});
						}}
						className="rounded border border-border px-4 py-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary"
					>
						Cancel
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={`group rounded-lg border bg-surface-light p-4 transition-colors ${isDone ? 'border-green-800/50 opacity-60' : 'border-border hover:border-border'}`}>
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-start gap-3 flex-1 min-w-0">
					{/* Checkbox */}
					<button
						onClick={handleToggleDone}
						disabled={loading}
						className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${isDone ? 'border-green-600 bg-green-600 text-black' : 'border-text-secondary hover:border-orange-accent'}`}
						title={isDone ? 'Mark as pending' : 'Mark as done'}
					>
						{isDone && (
							<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						)}
					</button>

					<div className="min-w-0 flex-1">
						<p className={`text-sm ${isDone ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
							{item.task}
						</p>
						<div className="mt-1.5 flex flex-wrap gap-3 text-xs text-text-secondary">
							{item.owner && (
								<span className="inline-flex items-center gap-1">
									<span className="text-orange-accent">●</span> {item.owner}
								</span>
							)}
							{item.dueDate && (
								<span>
									📅 {new Date(item.dueDate).toLocaleDateString()}
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
					<button
						onClick={() => setIsEditing(true)}
						disabled={loading}
						className="rounded p-1.5 text-text-secondary transition-colors hover:bg-surface-lighter hover:text-orange-accent"
						title="Edit"
					>
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
					</button>
					<button
						onClick={handleDelete}
						disabled={loading}
						className="rounded p-1.5 text-text-secondary transition-colors hover:bg-surface-lighter hover:text-red-400"
						title="Delete"
					>
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}

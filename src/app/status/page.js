'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';

function StatusDot({ status }) {
	const color =
		status === 'connected'
			? 'bg-green-500 shadow-green-500/40'
			: status === 'disconnected'
				? 'bg-red-500 shadow-red-500/40'
				: 'bg-yellow-500 shadow-yellow-500/40';

	return (
		<span className={`inline-block h-2.5 w-2.5 rounded-full shadow-md ${color}`} />
	);
}

function ServiceCard({ name, icon, status, latency, error, extra }) {
	return (
		<div className="rounded-xl border border-border bg-surface-light p-5 transition-colors hover:border-border">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="text-xl">{icon}</span>
					<h3 className="font-medium text-text-primary">{name}</h3>
				</div>
				<div className="flex items-center gap-2">
					<StatusDot status={status} />
					<span className={`text-xs font-medium capitalize ${status === 'connected' ? 'text-green-400' : status === 'disconnected' ? 'text-red-400' : 'text-yellow-400'}`}>
						{status}
					</span>
				</div>
			</div>

			<div className="mt-4 space-y-2">
				{latency !== null && latency !== undefined && (
					<div className="flex justify-between text-xs">
						<span className="text-text-secondary">Latency</span>
						<span className="font-mono text-text-primary">{latency}ms</span>
					</div>
				)}
				{extra && (
					<div className="flex justify-between text-xs">
						<span className="text-text-secondary">{extra.label}</span>
						<span className="font-mono text-text-primary">{extra.value}</span>
					</div>
				)}
				{error && (
					<p className="mt-2 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">
						{error}
					</p>
				)}
			</div>
		</div>
	);
}

function formatUptime(seconds) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);
	const parts = [];
	if (h > 0) parts.push(`${h}h`);
	if (m > 0) parts.push(`${m}m`);
	parts.push(`${s}s`);
	return parts.join(' ');
}

export default function StatusPage() {
	const [health, setHealth] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [lastChecked, setLastChecked] = useState(null);

	const fetchHealth = async () => {
		try {
			const res = await fetch('/api/health');
			const data = await res.json();
			setHealth(data);
			setLastChecked(new Date());
			setError('');
		} catch {
			setError('Failed to reach the server.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHealth();
	}, []);

	if (loading) return <Loader text="Checking system health..." />;

	const overallStatus = error
		? 'offline'
		: health?.status === 'ok'
			? 'operational'
			: 'degraded';

	const overallColor =
		overallStatus === 'operational'
			? 'text-green-400 border-green-500/30 bg-green-500/5'
			: overallStatus === 'degraded'
				? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5'
				: 'text-red-400 border-red-500/30 bg-red-500/5';

	return (
		<div className="space-y-10">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					System <span className="text-orange-accent">Status</span>
				</h1>
				<p className="mt-2 text-text-secondary">
					Real-time health overview of all services.
				</p>
			</div>

			{/* Overall Status Banner */}
			<div className={`flex items-center justify-between rounded-xl border p-5 ${overallColor}`}>
				<div className="flex items-center gap-3">
					<span className="text-2xl">
						{overallStatus === 'operational' ? '✅' : overallStatus === 'degraded' ? '⚠️' : '🔴'}
					</span>
					<div>
						<p className="font-semibold capitalize">{overallStatus === 'operational' ? 'All Systems Operational' : overallStatus === 'degraded' ? 'Partial Outage' : 'System Offline'}</p>
						{lastChecked && (
							<p className="mt-0.5 text-xs opacity-70">
								Last checked: {lastChecked.toLocaleTimeString()}
							</p>
						)}
					</div>
				</div>
				<button
					onClick={() => { setLoading(true); fetchHealth(); }}
					className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:text-orange-accent"
				>
					Refresh
				</button>
			</div>

			{error && (
				<p className="text-sm text-red-400">{error}</p>
			)}

			{health && (
				<>
					{/* Service Cards */}
					<div className="grid gap-4 sm:grid-cols-3">
						<ServiceCard
							name="Backend"
							icon="🖥️"
							status="connected"
							latency={null}
							extra={{ label: 'Uptime', value: formatUptime(health.uptime) }}
						/>
						<ServiceCard
							name="Database"
							icon="🗃️"
							status={health.services.database.status}
							latency={health.services.database.latency}
							error={health.services.database.error}
							extra={{ label: 'Engine', value: 'MongoDB' }}
						/>
						<ServiceCard
							name="LLM"
							icon="🤖"
							status={health.services.llm.status}
							latency={health.services.llm.latency}
							error={health.services.llm.error}
							extra={health.services.llm.model ? { label: 'Model', value: health.services.llm.model } : null}
						/>
					</div>

					{/* Stats */}
					<div className="rounded-xl border border-border bg-surface-light p-6">
						<h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">
							Usage Stats
						</h2>
						<div className="flex items-baseline gap-3">
							<span className="text-4xl font-bold text-orange-accent">
								{health.stats.totalTranscripts}
							</span>
							<span className="text-sm text-text-secondary">
								transcripts processed
							</span>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

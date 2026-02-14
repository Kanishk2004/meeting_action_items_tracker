'use client';

import { useState, useEffect } from 'react';

const STEPS = [
	{
		icon: '⚡',
		title: 'Welcome to ActionTracker',
		description:
			"Turn meeting chaos into clear action items — powered by AI. Let's walk you through how it works.",
	},
	{
		icon: '📋',
		title: 'Paste Your Transcript',
		description:
			'Copy and paste your raw meeting notes or transcript into the text area on the home page. No special format required.',
	},
	{
		icon: '🤖',
		title: 'AI Extracts Action Items',
		description:
			'Hit "Extract" and our AI identifies concrete tasks, assigns owners, and picks up deadlines — all automatically.',
	},
	{
		icon: '✏️',
		title: 'Edit, Complete & Delete',
		description:
			'Each action item can be edited inline, marked as done with a checkbox, or deleted. You stay in full control.',
	},
	{
		icon: '📂',
		title: 'View Past Transcripts',
		description:
			'Head to History to revisit your last 5 transcripts and their action items anytime.',
	},
];

const STORAGE_KEY = 'actiontracker_walkthrough_seen';

export default function Walkthrough() {
	const [visible, setVisible] = useState(false);
	const [step, setStep] = useState(0);

	useEffect(() => {
		try {
			const seen = localStorage.getItem(STORAGE_KEY);
			if (!seen) {
				setVisible(true);
			}
		} catch {
			// localStorage unavailable (e.g. private browsing) — show walkthrough anyway
			setVisible(true);
		}
	}, []);

	const handleNext = () => {
		if (step < STEPS.length - 1) {
			setStep(step + 1);
		} else {
			handleClose();
		}
	};

	const handleBack = () => {
		if (step > 0) setStep(step - 1);
	};

	const handleClose = () => {
		try {
			localStorage.setItem(STORAGE_KEY, 'true');
		} catch {
			// Ignore if localStorage is unavailable
		}
		setVisible(false);
	};

	if (!visible) return null;

	const current = STEPS[step];
	const isLast = step === STEPS.length - 1;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface-light shadow-2xl">
				{/* Skip button */}
				<button
					onClick={handleClose}
					className="absolute right-4 top-4 text-xs text-text-secondary transition-colors hover:text-text-primary">
					Skip
				</button>

				{/* Content */}
				<div className="px-8 pt-10 pb-6 text-center">
					<span className="mb-4 inline-block text-5xl">{current.icon}</span>
					<h2 className="mb-2 text-xl font-bold text-text-primary">
						{current.title}
					</h2>
					<p className="text-sm leading-relaxed text-text-secondary">
						{current.description}
					</p>
				</div>

				{/* Progress dots */}
				<div className="flex justify-center gap-1.5 pb-6">
					{STEPS.map((_, i) => (
						<button
							key={i}
							onClick={() => setStep(i)}
							className={`h-1.5 rounded-full transition-all ${
								i === step
									? 'w-6 bg-orange-accent'
									: 'w-1.5 bg-border hover:bg-text-secondary'
							}`}
						/>
					))}
				</div>

				{/* Actions */}
				<div className="flex items-center justify-between border-t border-border px-6 py-4">
					<button
						onClick={handleBack}
						disabled={step === 0}
						className="rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary disabled:invisible">
						Back
					</button>
					<button
						onClick={handleNext}
						className="rounded-lg bg-orange-accent px-6 py-2 text-sm font-semibold text-black transition-colors hover:bg-orange-hover">
						{isLast ? 'Get Started' : 'Next'}
					</button>
				</div>
			</div>
		</div>
	);
}

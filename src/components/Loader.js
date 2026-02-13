export default function Loader({ text = 'Loading...' }) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-20">
			<div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-orange-accent" />
			<p className="text-sm text-text-secondary">{text}</p>
		</div>
	);
}

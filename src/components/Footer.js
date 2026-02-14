import Link from 'next/link';

export default function Footer() {
	return (
		<footer className="mt-20 border-t border-border bg-surface-light/50">
			<div className="mx-auto max-w-5xl px-6 py-8">
				<div className="flex flex-col items-center gap-4 text-center">
					<p className="text-sm text-text-secondary">
						Built by{' '}
						<span className="font-medium text-text-primary">Kanishk Chandna</span>
						<span className="mx-1.5 text-border">·</span>
						Delhi, India
					</p>

					<div className="flex flex-wrap items-center justify-center gap-4 text-xs text-text-secondary">
						<a href="https://github.com/kanishk2004" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-orange-accent">
							GitHub
						</a>
						<span className="text-border">·</span>
						<a href="https://linkedin.com/in/kanishk-chandna" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-orange-accent">
							LinkedIn
						</a>
						<span className="text-border">·</span>
						<a href="https://blogs.kanishk.codes" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-orange-accent">
							Blog
						</a>
						<span className="text-border">·</span>
						<a href="https://x.com/kanishk_fr" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-orange-accent">
							X (Twitter)
						</a>
						<span className="text-border">·</span>
						<a href="https://drive.google.com/file/d/118GYlkRqykgcHEXY1gJPqtFokLU2QRTH/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-orange-accent">
							Resume
						</a>
						<span className="text-border">·</span>
						<a href="mailto:kanishkchandna29@gmail.com" className="transition-colors hover:text-orange-accent">
							kanishkchandna29@gmail.com
						</a>
						<span className="text-border">·</span>
						<a href="tel:+919268815903" className="transition-colors hover:text-orange-accent">
							+91-9268815903
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

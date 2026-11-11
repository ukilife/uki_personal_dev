import { Logo } from "./SiteNav";

export function SiteFooter() {
  return (
    <footer className="no-print border-t-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:px-8 md:flex-row md:items-center">
        <div>
          <Logo />
          <p className="mt-3 font-display text-lg font-semibold text-teal">Every Week, Unfold a New You.</p>
        </div>
        <div className="max-w-md text-sm text-ink-soft">
          <p>A personal development journey for students — one week at a time.</p>
          <p className="mt-1">Everything you type stays in this browser on this device — nothing is uploaded. 🌱</p>
        </div>
      </div>
    </footer>
  );
}

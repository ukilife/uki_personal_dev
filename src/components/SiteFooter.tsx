import { Logo } from "./SiteNav";

export function SiteFooter() {
  return (
    <footer className="no-print border-t-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:px-8 md:flex-row md:items-center">
        <Logo />
        <p className="max-w-md text-sm text-ink-soft">
          Everything you type stays in this browser on this device — nothing is uploaded. Grow at your own pace. 🌱
        </p>
      </div>
    </footer>
  );
}

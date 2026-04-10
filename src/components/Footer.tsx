export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-[--color-line] pt-16 md:pt-20 pb-28 md:pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <img
              src="/ikingdom-logo.png?v=1"
              alt="iKingdom"
              width={220}
              height={56}
              className="h-10 md:h-12 w-auto"
            />
            <p className="mt-4 text-sm text-[--color-fg-muted] max-w-sm leading-relaxed">
              The world's first AI operations firm. Designing and deploying
              autonomous companies for those building what comes next.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-5">
              The firm
            </p>
            <ul className="space-y-3 text-sm text-[--color-fg-muted]">
              <li>
                <a
                  href="#method"
                  className="hover:text-[--color-fg] transition-colors duration-300"
                >
                  Method
                </a>
              </li>
              <li>
                <a
                  href="#proof"
                  className="hover:text-[--color-fg] transition-colors duration-300"
                >
                  Proof
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  className="hover:text-[--color-fg] transition-colors duration-300"
                >
                  Process
                </a>
              </li>
              <li>
                <a
                  href="#apply"
                  className="hover:text-[--color-fg] transition-colors duration-300"
                >
                  Apply
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-5">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-[--color-fg-muted]">
              <li>
                <a
                  href="mailto:executive@ikingdom.org"
                  className="hover:text-[--color-fg] transition-colors duration-300"
                >
                  executive@ikingdom.org
                </a>
              </li>
              <li>By application only</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-[--color-line] flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-[--color-fg-dim]">
            © {year} iKingdom. All rights reserved.
          </p>
          <p className="text-xs text-[--color-fg-dim] tracking-wide">
            Established · The world's first AI operations firm
          </p>
        </div>
      </div>
    </footer>
  );
}

type Props = {
  number: string;
  label: string;
  description?: string;
};

export default function SectionDivider({ number, label, description }: Props) {
  return (
    <section
      aria-hidden="true"
      className="relative w-full"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="border-t border-[--color-line]" />
        <div className="py-16 md:py-24">
          <div className="flex items-end gap-6 md:gap-10">
            <span className="font-display text-[clamp(4rem,12vw,10rem)] leading-none tracking-tight text-[--color-fg]">
              {number}
            </span>
            <div className="flex flex-col gap-3 pb-3 md:pb-6">
              <span
                aria-hidden="true"
                className="font-display text-[clamp(2rem,5vw,4rem)] leading-none text-[--color-fg-dim]"
              >
                /
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[--color-fg-dim]">
                {label}
              </span>
              {description ? (
                <span className="font-serif italic text-sm md:text-base text-[--color-fg-dim] max-w-[42ch]">
                  {description}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="border-b border-[--color-line]" />
      </div>
    </section>
  );
}

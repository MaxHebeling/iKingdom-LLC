const clients = [
  "BuildCore Ai",
  "Distinct Construction Solutions",
  "Elite Control Group",
  "Kyros Global Capital",
  "Structura Aeternum",
];

const label = {
  en: "Trusted by",
  es: "Confían en nosotros",
};

export default function ClientLogos({ lang }: { lang: "en" | "es" }) {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[--color-fg-dim] mb-6">
          {label[lang]}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {clients.map((name, i) => (
            <span key={name} className="flex items-center gap-6">
              <span className="text-xs sm:text-sm uppercase tracking-[0.15em] text-[--color-fg-dim] whitespace-nowrap">
                {name}
              </span>
              {i < clients.length - 1 && (
                <span className="text-[--color-fg-dim] opacity-40 select-none" aria-hidden>
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

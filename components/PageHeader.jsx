export default function PageHeader({ eyebrow, title, blurb }) {
  return (
    <section
      className="relative overflow-hidden noise pt-36 pb-16"
      style={{
        background:
          "radial-gradient(ellipse at top left, #2a5249 0%, #1E3C36 55%, #16302B 100%)",
      }}
    >
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full border border-bronze/15" />

      <div className="container-x relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="bronze-bar" />
          <span className="eyebrow text-bronze">{eyebrow}</span>
        </div>
        <h1 className="display text-cream text-4xl sm:text-5xl lg:text-6xl mb-5 max-w-3xl">
          {title}
        </h1>
        {blurb && (
          <p className="text-cream/70 text-lg leading-relaxed max-w-2xl">
            {blurb}
          </p>
        )}
      </div>
    </section>
  );
}

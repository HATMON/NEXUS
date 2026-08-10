type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
        >
          {actionLabel} →
        </a>
      )}
    </div>
  );
}
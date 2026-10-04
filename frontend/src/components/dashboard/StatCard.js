export function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 border border-border bg-surface p-5">
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-surface-alt">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
      )}
      <div>
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-1 font-serif text-2xl text-foreground">{value}</p>
      </div>
    </div>
  );
}

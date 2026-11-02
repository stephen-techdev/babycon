export default function Loading() {
  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border border-line border-t-clay" />
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
          A little softness, loading
        </p>
      </div>
    </div>
  );
}

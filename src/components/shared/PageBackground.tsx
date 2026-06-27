interface PageBackgroundProps {
  variant?: "full" | "simple";
}

export default function PageBackground({ variant = "full" }: PageBackgroundProps) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#f94300]/20 blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#a25afd]/15 blur-[100px]" />
      {variant === "full" ? (
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#26ccff]/8 blur-[80px]" />
      ) : null}
    </div>
  );
}

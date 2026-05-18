export default function CheckoutLoading() {
  return (
    <div className="w-full max-w-[1140px] mx-auto px-12 py-24 flex flex-col items-center justify-center min-h-[500px]">
      <div className="w-12 h-12 rounded-full border-2 border-outline-variant border-t-secondary animate-spin mb-4" />
      <p className="font-serif italic text-on-surface-variant/80 text-sm">
        Preparing your checkout landscape...
      </p>
    </div>
  );
}

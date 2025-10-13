function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="h-3 w-3 animate-ping rounded-full bg-primary"></span>
      <span>{label}...</span>
    </div>
  );
}

export default Loader;

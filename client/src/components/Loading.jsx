export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-navy-500">
      <div className="h-10 w-10 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin mb-3" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

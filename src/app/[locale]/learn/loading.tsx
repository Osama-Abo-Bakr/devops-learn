export default function LearnLoading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-950 py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-500" />
        <p className="text-sm text-gray-500">Loading lesson...</p>
      </div>
    </div>
  );
}
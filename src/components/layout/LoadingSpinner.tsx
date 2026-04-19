export default function LoadingSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-500" />
    </div>
  );
}
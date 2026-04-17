export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-500" />
    </div>
  );
}
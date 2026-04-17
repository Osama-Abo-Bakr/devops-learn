"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="rounded-lg border border-red-800 bg-red-900/20 p-8 text-center">
        <h2 className="mb-2 text-xl font-bold text-red-400">
          Something went wrong
        </h2>
        <p className="mb-4 text-gray-400">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
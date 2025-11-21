import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">EdgeNet.AI</h1>
        <p className="text-xl mb-8">Proof-of-Inference DePIN MVP</p>
        <div className="flex gap-4">
          <Link
            href="/submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Task
          </Link>
          <Link
            href="/leaderboard"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}


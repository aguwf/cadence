import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-background to-primary/20">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-[5rem]">
          Welcome to Cadence
        </h1>
        <p className="text-2xl text-secondary font-medium">
          Your daily rhythm starts here
        </p>
        <Link
          href="/videos"
          className="rounded-full bg-primary px-10 py-4 text-xl font-bold text-white shadow-lg transition hover:bg-opacity-90 hover:scale-105"
        >
          Start Dancing
        </Link>
      </div>
    </main>
  );
}

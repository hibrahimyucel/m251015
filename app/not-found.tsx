import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full rounded-md border-2 border-red-600 p-3 text-center">
      <Link href="/">
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        Return Home
      </Link>
    </div>
  );
}

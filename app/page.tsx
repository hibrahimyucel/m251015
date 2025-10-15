import Image from "next/image";

export default function Home() {
  return (
    <main className="items-center">
      <Image
        className="dark:invert"
        src="/logo.jpg"
        alt="logo"
        width={180}
        height={38}
        priority
      />
    </main>
  );
}

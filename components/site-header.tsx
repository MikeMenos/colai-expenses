import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Αρχική"
          className="flex shrink-0 items-center rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Image
            src="/logo.png"
            alt="Mavrogenis"
            width={203}
            height={208}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>
      </div>
    </header>
  );
}

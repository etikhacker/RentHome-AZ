import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line py-5">
      <div className="max-w-[1120px] mx-auto px-7 flex items-center justify-between">
        <Link href="/" className="font-display text-[22px] font-semibold tracking-tight">
          Rent<span className="text-brick">Home</span> AZ
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-soft">
          <Link href="/elanlar" className="hover:text-ink">Kirayə axtar</Link>
          <Link href="/elan-yerlesdir" className="hover:text-ink">Elan yerləşdir</Link>
          <Link href="/haqqimizda" className="hover:text-ink">Necə işləyir</Link>
        </nav>

        <div className="flex items-center gap-3.5">
          <span className="text-[13px] text-ink-soft border border-line px-2.5 py-1 rounded">
            AZ / EN
          </span>
          <Link href="/giris" className="px-4 py-2 rounded-md text-sm font-medium border border-ink">
            Giriş
          </Link>
          <Link href="/qeydiyyat" className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-white hover:bg-teal-deep">
            Qeydiyyat
          </Link>
        </div>
      </div>
    </header>
  );
}

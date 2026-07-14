import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/giris?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <>
        <SiteHeader />
        <div className="max-w-[600px] mx-auto px-7 py-16 text-center">
          <h1 className="font-display text-2xl font-medium mb-3">Bura yalnız adminlər üçündür</h1>
          <p className="text-sm text-ink-soft">Bu bölməyə girişin yoxdur.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="max-w-[1120px] mx-auto px-7 py-8">
        <nav className="flex gap-6 border-b border-line mb-7 text-sm">
          <Link href="/admin" className="pb-3 border-b-2 border-transparent hover:border-teal">
            Dashboard
          </Link>
          <Link href="/admin/elanlar" className="pb-3 border-b-2 border-transparent hover:border-teal">
            Elanlar
          </Link>
          <Link href="/admin/istifadeciler" className="pb-3 border-b-2 border-transparent hover:border-teal">
            İstifadəçilər
          </Link>
        </nav>
        {children}
      </div>
    </>
  );
}
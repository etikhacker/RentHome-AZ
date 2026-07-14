import { SiteHeader } from "@/components/layout/site-header";
import { ContactForm } from "@/components/contact/contact-form";

export default function ElaqePage() {
  return (
    <>
      <SiteHeader />
      <div className="max-w-[600px] mx-auto px-7 py-14">
        <h1 className="font-display text-2xl font-medium mb-2">Bizimlə əlaqə</h1>
        <p className="text-sm text-ink-soft mb-8">
          Sualın, təklifin və ya şikayətin varsa, aşağıdakı formu doldur — tezliklə sənə
          geri dönəcəyik.
        </p>
        <ContactForm />
      </div>
    </>
  );
}
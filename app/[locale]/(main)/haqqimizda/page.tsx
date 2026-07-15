import { SiteHeader } from "@/components/layout/site-header";

const steps = [
  {
    title: "1. Qeydiyyatdan keç",
    text: "İcarəçi və ya ev sahibi kimi qeydiyyatdan keç. Google ilə də daxil ola bilərsən.",
  },
  {
    title: "2. Axtar və ya elan yerləşdir",
    text: "İcarəçisənsə şəhər, qiymət və otaq sayına görə axtar. Ev sahibisənsə pulsuz elan yerləşdir.",
  },
  {
    title: "3. Admin təsdiqi",
    text: "Hər yeni elan saytda görünməzdən əvvəl admin tərəfindən yoxlanılır — bu, saxta elanların qarşısını alır.",
  },
  {
    title: "4. Birbaşa əlaqə",
    text: "Bəyəndiyin elanın sahibi ilə birbaşa mesajlaşırsan və ya zəng edirsən — heç bir vasitəçi, heç bir komissiya yoxdur.",
  },
];

export default function HaqqimizdaPage() {
  return (
    <>
      <SiteHeader />
      <div className="max-w-[720px] mx-auto px-7 py-14">
        <h1 className="font-display text-2xl font-medium mb-2">Necə işləyir</h1>
        <p className="text-sm text-ink-soft mb-10">
          RentHome AZ Azərbaycanda ev icarəsini vasitəçisiz, sadə və etibarlı edir.
        </p>

        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.title} className="bg-paper border border-line rounded-2xl p-5">
              <h2 className="font-display text-lg font-medium mb-1.5">{s.title}</h2>
              <p className="text-sm text-ink-soft">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
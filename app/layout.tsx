// Kök layout — sadəcə "keçid". Əsl <html>/<body> və metadata
// app/[locale]/layout.tsx-də idarə olunur. Bu fayl yalnız
// locale prefiksi olmayan hallar (məs. app/not-found.tsx) üçün lazımdır.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export default function ElanDetayPage({ params }: { params: { id: string } }) {
  // TODO: property + property_images + owner profile-i Supabase-dən çək
  return <div className="p-8">Elan detayı: {params.id}</div>;
}

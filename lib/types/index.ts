export type Role = "admin" | "ev_sahibi" | "icarechi";

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: Role;
  created_at: string;
};

export type PropertyType = "menzil" | "heyet_evi" | "ofis";

export type Property = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  city_id: string;
  district_id: string | null;
  address: string;
  price: number;
  rooms: number;
  floor: number | null;
  total_floors: number | null;
  area_m2: number;
  is_renovated: boolean;
  is_furnished: boolean;
  has_balcony: boolean;
  has_elevator: boolean;
  utilities_included: boolean;
  property_type: PropertyType;
  phone: string;
  whatsapp: string | null;
  map_url: string | null;
  is_premium: boolean;
  status: "gozleyir" | "tesdiqlendi" | "reddedildi";
  view_count: number;
  created_at: string;
};

export type PropertyImage = {
  id: string;
  property_id: string;
  url: string;
  sort_order: number;
};

export type City = { id: string; name: string; slug: string };
export type District = { id: string; city_id: string; name: string };

export type Favorite = {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
};

export type Message = {
  id: string;
  property_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

export type PropertyFilters = {
  city_id?: string;
  district_id?: string;
  min_price?: number;
  max_price?: number;
  rooms?: number;
  property_type?: PropertyType;
  is_renovated?: boolean;
  has_elevator?: boolean;
  is_furnished?: boolean;
};
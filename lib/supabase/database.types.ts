export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string;
          reservation_reference: string;
          customer_name: string;
          customer_email: string;
          guest_count: number;
          starts_at: string;
          ends_at: string;
          special_requests: string | null;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          language: "de" | "en";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reservation_reference?: string;
          customer_name: string;
          customer_email: string;
          guest_count: number;
          starts_at: string;
          ends_at: string;
          special_requests?: string | null;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          language?: "de" | "en";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reservations"]["Insert"]>;
        Relationships: [];
      };
      opening_hours: {
        Row: { id: string; weekday: number; is_closed: boolean; opens_at: string | null; closes_at: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; weekday: number; is_closed?: boolean; opens_at?: string | null; closes_at?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["opening_hours"]["Insert"]>;
        Relationships: [];
      };
      opening_exceptions: {
        Row: { id: string; exception_date: string; is_closed: boolean; opens_at: string | null; closes_at: string | null; reason: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; exception_date: string; is_closed?: boolean; opens_at?: string | null; closes_at?: string | null; reason?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["opening_exceptions"]["Insert"]>;
        Relationships: [];
      };
      booking_settings: {
        Row: { id: "default"; time_zone: string; reservation_duration_minutes: number; booking_interval_minutes: number; max_online_guests: number; advance_booking_months: number; first_reservation_time: string; last_reservation_time: string; larger_party_contact: string; created_at: string; updated_at: string };
        Insert: { id?: "default"; time_zone?: string; reservation_duration_minutes?: number; booking_interval_minutes?: number; max_online_guests?: number; advance_booking_months?: number; first_reservation_time?: string; last_reservation_time?: string; larger_party_contact?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["booking_settings"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_reservation_atomic: {
        Args: {
          p_customer_name: string;
          p_customer_email: string;
          p_guest_count: number;
          p_starts_at: string;
          p_special_requests: string | null;
          p_language: "de" | "en";
        };
        Returns: Array<{
          reservation_reference: string;
          starts_at: string;
          ends_at: string;
          guest_count: number;
        }>;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];

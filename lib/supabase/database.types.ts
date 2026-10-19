export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      cafe_tables: {
        Row: {
          id: string;
          table_identifier: string;
          seating_capacity: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          table_identifier: string;
          seating_capacity: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cafe_tables"]["Insert"]>;
        Relationships: [];
      };
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
      reservation_table_assignments: {
        Row: { id: string; reservation_id: string; cafe_table_id: string; created_at: string };
        Insert: { id?: string; reservation_id: string; cafe_table_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["reservation_table_assignments"]["Insert"]>;
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
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];

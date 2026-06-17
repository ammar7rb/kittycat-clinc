export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      branches: {
        Row: {
          address_ar: string | null
          address_en: string | null
          created_at: string
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          maps_embed: string | null
          maps_url: string | null
          name_ar: string
          name_en: string
          phone: string | null
          slug: string
          sort_order: number
          updated_at: string
          whatsapp: string | null
          working_hours_ar: string | null
          working_hours_en: string | null
        }
        Insert: {
          address_ar?: string | null
          address_en?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          maps_embed?: string | null
          maps_url?: string | null
          name_ar: string
          name_en: string
          phone?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
          whatsapp?: string | null
          working_hours_ar?: string | null
          working_hours_en?: string | null
        }
        Update: {
          address_ar?: string | null
          address_en?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          maps_embed?: string | null
          maps_url?: string | null
          name_ar?: string
          name_en?: string
          phone?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
          whatsapp?: string | null
          working_hours_ar?: string | null
          working_hours_en?: string | null
        }
        Relationships: []
      }
      doctors: {
        Row: {
          branch_id: string
          created_at: string
          id: string
          is_active: boolean
          name_ar: string
          name_en: string | null
          photo_url: string | null
          sort_order: number
          title_ar: string | null
          title_en: string | null
          updated_at: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar: string
          name_en?: string | null
          photo_url?: string | null
          sort_order?: number
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string | null
          photo_url?: string | null
          sort_order?: number
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          id: string
          mime_type: string | null
          public_url: string
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string | null
          public_url: string
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          public_url?: string
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          layout: string
          sort_order: number
          start_date: string | null
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          layout?: string
          sort_order?: number
          start_date?: string | null
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          layout?: string
          sort_order?: number
          start_date?: string | null
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string | null
          category: Database["public"]["Enums"]["product_category"]
          compare_at_price: number | null
          created_at: string
          currency: string
          description_ar: string | null
          description_en: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          name_ar: string
          name_en: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          price: number
          sort_order: number
          stock: number
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          compare_at_price?: number | null
          created_at?: string
          currency?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name_ar: string
          name_en: string
          pet_type?: Database["public"]["Enums"]["pet_type"]
          price?: number
          sort_order?: number
          stock?: number
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          compare_at_price?: number | null
          created_at?: string
          currency?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name_ar?: string
          name_en?: string
          pet_type?: Database["public"]["Enums"]["pet_type"]
          price?: number
          sort_order?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name_ar: string
          name_en: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_ar: string
          name_en: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_ar?: string
          name_en?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          created_at: string
          group_name: string | null
          id: string
          key: string
          updated_at: string
          value_ar: string | null
          value_en: string | null
        }
        Insert: {
          created_at?: string
          group_name?: string | null
          id?: string
          key: string
          updated_at?: string
          value_ar?: string | null
          value_en?: string | null
        }
        Update: {
          created_at?: string
          group_name?: string | null
          id?: string
          key?: string
          updated_at?: string
          value_ar?: string | null
          value_en?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      pet_type: "cat" | "dog" | "both"
      product_category: "food" | "accessories" | "toys" | "health" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      pet_type: ["cat", "dog", "both"],
      product_category: ["food", "accessories", "toys", "health", "other"],
    },
  },
} as const

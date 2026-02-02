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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          contact_email: string | null
          created_at: string | null
          default_contributor_payout_percent: number | null
          id: string
          logo_url: string | null
          marketplace_name: string | null
          max_upload_size_mb: number | null
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          default_contributor_payout_percent?: number | null
          id?: string
          logo_url?: string | null
          marketplace_name?: string | null
          max_upload_size_mb?: number | null
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          default_contributor_payout_percent?: number | null
          id?: string
          logo_url?: string | null
          marketplace_name?: string | null
          max_upload_size_mb?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          category: string | null
          contributor_id: string | null
          created_at: string | null
          description: string | null
          downloads: number | null
          id: string
          is_demo: boolean | null
          is_featured: boolean | null
          license: string
          preview_path: string | null
          price: number
          rejected_reason: string | null
          status: string
          storage_path: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          category?: string | null
          contributor_id?: string | null
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          id?: string
          is_demo?: boolean | null
          is_featured?: boolean | null
          license?: string
          preview_path?: string | null
          price?: number
          rejected_reason?: string | null
          status?: string
          storage_path: string
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          category?: string | null
          contributor_id?: string | null
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          id?: string
          is_demo?: boolean | null
          is_featured?: boolean | null
          license?: string
          preview_path?: string | null
          price?: number
          rejected_reason?: string | null
          status?: string
          storage_path?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      downloads: {
        Row: {
          contributor_earned_cents: number | null
          created_at: string | null
          id: string
          image_id: string
          license_type: string
          price_paid_cents: number | null
          user_id: string | null
        }
        Insert: {
          contributor_earned_cents?: number | null
          created_at?: string | null
          id?: string
          image_id: string
          license_type: string
          price_paid_cents?: number | null
          user_id?: string | null
        }
        Update: {
          contributor_earned_cents?: number | null
          created_at?: string | null
          id?: string
          image_id?: string
          license_type?: string
          price_paid_cents?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      earnings: {
        Row: {
          amount: number
          contributor_id: string | null
          created_at: string | null
          id: string
          order_id: string | null
        }
        Insert: {
          amount: number
          contributor_id?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
        }
        Update: {
          amount?: number
          contributor_id?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "earnings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      image_tags: {
        Row: {
          image_id: string
          tag_id: string
        }
        Insert: {
          image_id: string
          tag_id: string
        }
        Update: {
          image_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_tags_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          ai_tags: string[] | null
          created_at: string | null
          description: string | null
          dominant_colors: string[] | null
          download_count: number | null
          format: string | null
          has_people: boolean | null
          height: number | null
          id: string
          is_approved: boolean | null
          is_community_free: boolean | null
          license_type: string
          price_cents: number | null
          size_bytes: number | null
          storage_path: string
          title: string
          updated_at: string | null
          uploader_id: string
          width: number | null
        }
        Insert: {
          ai_tags?: string[] | null
          created_at?: string | null
          description?: string | null
          dominant_colors?: string[] | null
          download_count?: number | null
          format?: string | null
          has_people?: boolean | null
          height?: number | null
          id?: string
          is_approved?: boolean | null
          is_community_free?: boolean | null
          license_type: string
          price_cents?: number | null
          size_bytes?: number | null
          storage_path: string
          title: string
          updated_at?: string | null
          uploader_id: string
          width?: number | null
        }
        Update: {
          ai_tags?: string[] | null
          created_at?: string | null
          description?: string | null
          dominant_colors?: string[] | null
          download_count?: number | null
          format?: string | null
          has_people?: boolean | null
          height?: number | null
          id?: string
          is_approved?: boolean | null
          is_community_free?: boolean | null
          license_type?: string
          price_cents?: number | null
          size_bytes?: number | null
          storage_path?: string
          title?: string
          updated_at?: string | null
          uploader_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "images_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          asset_id: string | null
          buyer_id: string | null
          created_at: string | null
          currency: string
          id: string
          payment_provider: string
          price_paid: number
          provider_payment_id: string | null
          status: string
        }
        Insert: {
          asset_id?: string | null
          buyer_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          payment_provider: string
          price_paid: number
          provider_payment_id?: string | null
          status?: string
        }
        Update: {
          asset_id?: string | null
          buyer_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          payment_provider?: string
          price_paid?: number
          provider_payment_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          application_date: string | null
          application_message: string | null
          avatar_url: string | null
          bio: string | null
          contributor_tier: string | null
          created_at: string | null
          id: string
          lifetime_earnings_cents: number | null
          portfolio_url: string | null
          role: string | null
          total_download_count: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          application_date?: string | null
          application_message?: string | null
          avatar_url?: string | null
          bio?: string | null
          contributor_tier?: string | null
          created_at?: string | null
          id: string
          lifetime_earnings_cents?: number | null
          portfolio_url?: string | null
          role?: string | null
          total_download_count?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          application_date?: string | null
          application_message?: string | null
          avatar_url?: string | null
          bio?: string | null
          contributor_tier?: string | null
          created_at?: string | null
          id?: string
          lifetime_earnings_cents?: number | null
          portfolio_url?: string | null
          role?: string | null
          total_download_count?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          ends_at: string | null
          id: string
          plan_id: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          ends_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
          status: string
          user_id: string
        }
        Update: {
          ends_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

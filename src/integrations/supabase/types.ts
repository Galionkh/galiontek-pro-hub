export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          business_field: string | null
          city: string | null
          client_type: string | null
          contact: string | null
          created_at: string | null
          email: string | null
          id: number
          institution_number: string | null
          institution_type: string | null
          name: string | null
          notes: string | null
          principal_email: string | null
          principal_name: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          business_field?: string | null
          city?: string | null
          client_type?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          institution_number?: string | null
          institution_type?: string | null
          name?: string | null
          notes?: string | null
          principal_email?: string | null
          principal_name?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          business_field?: string | null
          city?: string | null
          client_type?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          institution_number?: string | null
          institution_type?: string | null
          name?: string | null
          notes?: string | null
          principal_email?: string | null
          principal_name?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          id: number
          location: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: number
          location?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: number
          location?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string
          date: string
          duration_minutes: number
          end_time: string
          id: string
          order_id: number
          start_time: string
          teaching_units: number
          topic: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          duration_minutes: number
          end_time: string
          id?: string
          order_id: number
          start_time: string
          teaching_units: number
          topic?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          duration_minutes?: number
          end_time?: string
          id?: string
          order_id?: number
          start_time?: string
          teaching_units?: number
          topic?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          order_id: number | null
          price: number | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          order_id?: number | null
          price?: number | null
          quantity?: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          order_id?: number | null
          price?: number | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number | null
          client_id: string | null
          client_name: string | null
          created_at: string | null
          date: string | null
          description: string | null
          hourly_rate: number | null
          hours: number | null
          id: number
          notes: string | null
          payment_terms: string | null
          service_topic: string | null
          status: string | null
          title: string
          total_amount: number | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          client_id?: string | null
          client_name?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          hourly_rate?: number | null
          hours?: number | null
          id?: number
          notes?: string | null
          payment_terms?: string | null
          service_topic?: string | null
          status?: string | null
          title: string
          total_amount?: number | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          client_id?: string | null
          client_name?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          hourly_rate?: number | null
          hours?: number | null
          id?: number
          notes?: string | null
          payment_terms?: string | null
          service_topic?: string | null
          status?: string | null
          title?: string
          total_amount?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          email: string | null
          id: number
          name: string
          orgname: string | null
          tel: string | null
          user_id: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          name: string
          orgname?: string | null
          tel?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          name?: string
          orgname?: string | null
          tel?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          description: string | null
          id: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          dark_mode: boolean | null
          font_size: string | null
          id: string
          logo_url: string | null
          sidebar_items: Json
          system_icon: string | null
          system_name: string | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dark_mode?: boolean | null
          font_size?: string | null
          id?: string
          logo_url?: string | null
          sidebar_items?: Json
          system_icon?: string | null
          system_name?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dark_mode?: boolean | null
          font_size?: string | null
          id?: string
          logo_url?: string | null
          sidebar_items?: Json
          system_icon?: string | null
          system_name?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

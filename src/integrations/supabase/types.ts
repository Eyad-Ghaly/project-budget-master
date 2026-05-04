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
      boq_items: {
        Row: {
          block: string
          construction_equipment: number
          contingencies: number
          created_at: string
          description: string
          direct_manpower: number
          discipline: string
          id: string
          indirect_cost: number
          indirect_manpower: number
          item_code: string
          logistics: number
          overheads: number
          profit: number
          project_id: string
          quantity: number
          selling_price: number
          specification: string
          subcontract_construction: number
          subcontract_engineering: number
          supply_materials: number
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          block?: string
          construction_equipment?: number
          contingencies?: number
          created_at?: string
          description?: string
          direct_manpower?: number
          discipline?: string
          id?: string
          indirect_cost?: number
          indirect_manpower?: number
          item_code?: string
          logistics?: number
          overheads?: number
          profit?: number
          project_id: string
          quantity?: number
          selling_price?: number
          specification?: string
          subcontract_construction?: number
          subcontract_engineering?: number
          supply_materials?: number
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          block?: string
          construction_equipment?: number
          contingencies?: number
          created_at?: string
          description?: string
          direct_manpower?: number
          discipline?: string
          id?: string
          indirect_cost?: number
          indirect_manpower?: number
          item_code?: string
          logistics?: number
          overheads?: number
          profit?: number
          project_id?: string
          quantity?: number
          selling_price?: number
          specification?: string
          subcontract_construction?: number
          subcontract_engineering?: number
          supply_materials?: number
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "boq_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_equipment_items: {
        Row: {
          amount: number
          created_at: string
          discipline: string
          equipment_name: string
          id: string
          project_id: string
          quantity: number
          unit: string
          unit_cost: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          discipline?: string
          equipment_name?: string
          id?: string
          project_id: string
          quantity?: number
          unit?: string
          unit_cost?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          discipline?: string
          equipment_name?: string
          id?: string
          project_id?: string
          quantity?: number
          unit?: string
          unit_cost?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_equipment_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_manpower_items: {
        Row: {
          amount: number
          created_at: string
          discipline: string
          id: string
          manweeks: number
          project_id: string
          rate_per_week: number
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          discipline?: string
          id?: string
          manweeks?: number
          project_id: string
          rate_per_week?: number
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          discipline?: string
          id?: string
          manweeks?: number
          project_id?: string
          rate_per_week?: number
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_manpower_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      indirect_cost_items: {
        Row: {
          amount: number
          created_at: string
          id: string
          item_name: string
          notes: string
          project_id: string
          sub_category: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          item_name?: string
          notes?: string
          project_id: string
          sub_category?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          item_name?: string
          notes?: string
          project_id?: string
          sub_category?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "indirect_cost_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      indirect_manpower_items: {
        Row: {
          amount: number
          cost_code: string
          created_at: string
          id: string
          location_type: string
          manweeks: number
          project_id: string
          rate_per_week: number
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          cost_code?: string
          created_at?: string
          id?: string
          location_type?: string
          manweeks?: number
          project_id: string
          rate_per_week?: number
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          cost_code?: string
          created_at?: string
          id?: string
          location_type?: string
          manweeks?: number
          project_id?: string
          rate_per_week?: number
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "indirect_manpower_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      material_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          notes: string
          project_id: string
          sub_category: string
          supplier_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          notes?: string
          project_id: string
          sub_category?: string
          supplier_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          notes?: string
          project_id?: string
          sub_category?: string
          supplier_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          cost_center_name: string
          cost_center_number: string
          created_at: string
          currency: string
          direct_equipment: number
          direct_manpower: number
          id: string
          indirect_cost: number
          indirect_manpower: number
          materials: number
          md_target: number
          om_target: number
          overheads: number
          pm_target: number
          project_name: string
          project_revenue: number
          revision_date: string
          revision_number: number
          services: number
          status: string
          subcontractors: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cost_center_name?: string
          cost_center_number?: string
          created_at?: string
          currency?: string
          direct_equipment?: number
          direct_manpower?: number
          id?: string
          indirect_cost?: number
          indirect_manpower?: number
          materials?: number
          md_target?: number
          om_target?: number
          overheads?: number
          pm_target?: number
          project_name?: string
          project_revenue?: number
          revision_date?: string
          revision_number?: number
          services?: number
          status?: string
          subcontractors?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cost_center_name?: string
          cost_center_number?: string
          created_at?: string
          currency?: string
          direct_equipment?: number
          direct_manpower?: number
          id?: string
          indirect_cost?: number
          indirect_manpower?: number
          materials?: number
          md_target?: number
          om_target?: number
          overheads?: number
          pm_target?: number
          project_name?: string
          project_revenue?: number
          revision_date?: string
          revision_number?: number
          services?: number
          status?: string
          subcontractors?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_items: {
        Row: {
          amount: number
          created_at: string
          discipline: string
          id: string
          project_id: string
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          discipline?: string
          id?: string
          project_id: string
          service_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          discipline?: string
          id?: string
          project_id?: string
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      subcontractor_items: {
        Row: {
          amount: number
          company_name: string
          created_at: string
          description: string
          id: string
          project_id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          company_name?: string
          created_at?: string
          description?: string
          id?: string
          project_id: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          company_name?: string
          created_at?: string
          description?: string
          id?: string
          project_id?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcontractor_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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

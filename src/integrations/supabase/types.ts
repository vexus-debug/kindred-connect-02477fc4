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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          created_at: string
          description: string
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          chair: string | null
          created_at: string
          id: string
          is_walk_in: boolean
          notes: string | null
          patient_id: string
          series_id: string | null
          staff_id: string
          status: string
          treatment_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          chair?: string | null
          created_at?: string
          id?: string
          is_walk_in?: boolean
          notes?: string | null
          patient_id: string
          series_id?: string | null
          staff_id: string
          status?: string
          treatment_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          chair?: string | null
          created_at?: string
          id?: string
          is_walk_in?: boolean
          notes?: string | null
          patient_id?: string
          series_id?: string | null
          staff_id?: string
          status?: string
          treatment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "recurring_appointment_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_chairs: {
        Row: {
          created_at: string
          id: string
          name: string
          room: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          room?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          room?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      clinic_documents: {
        Row: {
          category: string
          created_at: string
          expiry_date: string | null
          file_url: string
          id: string
          notes: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          file_url: string
          id?: string
          notes?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          file_url?: string
          id?: string
          notes?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      clinic_settings: {
        Row: {
          address: string | null
          clinic_name: string
          closing_time: string | null
          email: string | null
          id: string
          opening_time: string | null
          phone: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          clinic_name?: string
          closing_time?: string | null
          email?: string | null
          id?: string
          opening_time?: string | null
          phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          clinic_name?: string
          closing_time?: string | null
          email?: string | null
          id?: string
          opening_time?: string | null
          phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      clinical_notes: {
        Row: {
          appointment_id: string | null
          assessment: string | null
          created_at: string
          created_by: string | null
          id: string
          objective: string | null
          patient_id: string
          plan: string | null
          subjective: string | null
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          assessment?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          objective?: string | null
          patient_id: string
          plan?: string | null
          subjective?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          assessment?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          objective?: string | null
          patient_id?: string
          plan?: string | null
          subjective?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_notes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_form_templates: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dental_chart_entries: {
        Row: {
          created_at: string
          dentist_id: string | null
          entry_date: string
          id: string
          notes: string | null
          patient_id: string
          procedure: string
          status: string
          tooth_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dentist_id?: string | null
          entry_date?: string
          id?: string
          notes?: string | null
          patient_id: string
          procedure: string
          status?: string
          tooth_number: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dentist_id?: string | null
          entry_date?: string
          id?: string
          notes?: string | null
          patient_id?: string
          procedure?: string
          status?: string
          tooth_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dental_chart_entries_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dental_chart_entries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          expense_date: string
          id: string
          payment_method: string | null
          receipt_reference: string | null
          updated_at: string
          vendor: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          receipt_reference?: string | null
          updated_at?: string
          vendor?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          receipt_reference?: string | null
          updated_at?: string
          vendor?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string
          created_at: string
          id: string
          last_restocked: string | null
          min_stock: number
          name: string
          quantity: number
          supplier: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          last_restocked?: string | null
          min_stock?: number
          name: string
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          last_restocked?: string | null
          min_stock?: number
          name?: string
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          line_total: number
          quantity: number
          treatment_id: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          invoice_id: string
          line_total?: number
          quantity?: number
          treatment_id?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          line_total?: number
          quantity?: number
          treatment_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          created_at: string
          discount_percent: number
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          patient_id: string
          payment_method: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          created_at?: string
          discount_percent?: number
          id?: string
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          patient_id: string
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          discount_percent?: number
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          patient_id?: string
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_allocation_rules: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          percentage: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_active?: boolean
          percentage?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          percentage?: number
          updated_at?: string
        }
        Relationships: []
      }
      lab_case_history: {
        Row: {
          changed_by: string | null
          created_at: string
          field_changed: string
          id: string
          lab_case_id: string
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          field_changed: string
          id?: string
          lab_case_id: string
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          field_changed?: string
          id?: string
          lab_case_id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_case_history_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "lab_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_case_images: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          lab_case_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          lab_case_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          lab_case_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_case_images_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "lab_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_case_notes: {
        Row: {
          created_at: string
          id: string
          lab_case_id: string
          note: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lab_case_id: string
          note: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lab_case_id?: string
          note?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_case_notes_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "lab_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_cases: {
        Row: {
          assigned_technician_id: string | null
          case_number: string
          clinic_code: string | null
          clinic_doctor_name: string | null
          completed_date: string | null
          created_at: string
          delivered_date: string | null
          delivery_method: string | null
          dentist_id: string
          discount: number | null
          due_date: string | null
          id: string
          instructions: string | null
          is_paid: boolean
          is_urgent: boolean
          job_description: string | null
          job_instructions: string[] | null
          lab_fee: number
          net_amount: number | null
          patient_id: string
          registered_by: string | null
          registered_by_name: string | null
          remark: string | null
          sent_date: string | null
          shade: string | null
          status: string
          tooth_number: number | null
          treatment_id: string | null
          updated_at: string
          work_type: string
        }
        Insert: {
          assigned_technician_id?: string | null
          case_number?: string
          clinic_code?: string | null
          clinic_doctor_name?: string | null
          completed_date?: string | null
          created_at?: string
          delivered_date?: string | null
          delivery_method?: string | null
          dentist_id: string
          discount?: number | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          is_paid?: boolean
          is_urgent?: boolean
          job_description?: string | null
          job_instructions?: string[] | null
          lab_fee?: number
          net_amount?: number | null
          patient_id: string
          registered_by?: string | null
          registered_by_name?: string | null
          remark?: string | null
          sent_date?: string | null
          shade?: string | null
          status?: string
          tooth_number?: number | null
          treatment_id?: string | null
          updated_at?: string
          work_type: string
        }
        Update: {
          assigned_technician_id?: string | null
          case_number?: string
          clinic_code?: string | null
          clinic_doctor_name?: string | null
          completed_date?: string | null
          created_at?: string
          delivered_date?: string | null
          delivery_method?: string | null
          dentist_id?: string
          discount?: number | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          is_paid?: boolean
          is_urgent?: boolean
          job_description?: string | null
          job_instructions?: string[] | null
          lab_fee?: number
          net_amount?: number | null
          patient_id?: string
          registered_by?: string | null
          registered_by_name?: string | null
          remark?: string | null
          sent_date?: string | null
          shade?: string | null
          status?: string
          tooth_number?: number | null
          treatment_id?: string | null
          updated_at?: string
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_cases_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_cases_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_cases_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_invoices: {
        Row: {
          amount_paid: number
          clinic_code: string | null
          clinic_doctor_name: string | null
          created_at: string
          created_by: string | null
          discount: number
          id: string
          invoice_date: string
          invoice_number: string
          lab_case_id: string | null
          notes: string | null
          patient_name: string | null
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          clinic_code?: string | null
          clinic_doctor_name?: string | null
          created_at?: string
          created_by?: string | null
          discount?: number
          id?: string
          invoice_date?: string
          invoice_number?: string
          lab_case_id?: string | null
          notes?: string | null
          patient_name?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          clinic_code?: string | null
          clinic_doctor_name?: string | null
          created_at?: string
          created_by?: string | null
          discount?: number
          id?: string
          invoice_date?: string
          invoice_number?: string
          lab_case_id?: string | null
          notes?: string | null
          patient_name?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_invoices_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "lab_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_orders: {
        Row: {
          created_at: string
          dentist_id: string
          due_date: string | null
          id: string
          lab_name: string
          lab_work_type: string
          notes: string | null
          patient_id: string
          received_date: string | null
          sent_date: string | null
          status: string
          treatment_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dentist_id: string
          due_date?: string | null
          id?: string
          lab_name?: string
          lab_work_type: string
          notes?: string | null
          patient_id: string
          received_date?: string | null
          sent_date?: string | null
          status?: string
          treatment_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dentist_id?: string
          due_date?: string | null
          id?: string
          lab_name?: string
          lab_work_type?: string
          notes?: string | null
          patient_id?: string
          received_date?: string | null
          sent_date?: string | null
          status?: string
          treatment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_orders_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_revenue_allocations: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          lab_invoice_id: string
          percentage: number
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          id?: string
          lab_invoice_id: string
          percentage: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          lab_invoice_id?: string
          percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "lab_revenue_allocations_lab_invoice_id_fkey"
            columns: ["lab_invoice_id"]
            isOneToOne: false
            referencedRelation: "lab_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      message_attachments: {
        Row: {
          created_at: string
          entity_id: string
          entity_label: string
          entity_type: string
          id: string
          message_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_label?: string
          entity_type: string
          id?: string
          message_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_label?: string
          entity_type?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_recipients: {
        Row: {
          created_at: string
          id: string
          message_id: string
          read: boolean
          read_at: string | null
          recipient_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          read?: boolean
          read_at?: string | null
          recipient_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          read?: boolean
          read_at?: string | null
          recipient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          broadcast_role: string | null
          content: string
          created_at: string
          id: string
          is_broadcast: boolean
          sender_id: string
        }
        Insert: {
          broadcast_role?: string | null
          content: string
          created_at?: string
          id?: string
          is_broadcast?: boolean
          sender_id: string
        }
        Update: {
          broadcast_role?: string | null
          content?: string
          created_at?: string
          id?: string
          is_broadcast?: boolean
          sender_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          appointment_reminders: boolean
          id: string
          lab_completion_alerts: boolean
          low_stock_alerts: boolean
          payment_alerts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_reminders?: boolean
          id?: string
          lab_completion_alerts?: boolean
          low_stock_alerts?: boolean
          payment_alerts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_reminders?: boolean
          id?: string
          lab_completion_alerts?: boolean
          low_stock_alerts?: boolean
          payment_alerts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      patient_consent_forms: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          patient_id: string
          signed_at: string | null
          signer_name: string | null
          status: string
          template_id: string | null
          title: string
          treatment_plan_id: string | null
          updated_at: string
          witnessed_by: string | null
        }
        Insert: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          patient_id: string
          signed_at?: string | null
          signer_name?: string | null
          status?: string
          template_id?: string | null
          title: string
          treatment_plan_id?: string | null
          updated_at?: string
          witnessed_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          patient_id?: string
          signed_at?: string | null
          signer_name?: string | null
          status?: string
          template_id?: string | null
          title?: string
          treatment_plan_id?: string | null
          updated_at?: string
          witnessed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_consent_forms_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_consent_forms_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "consent_form_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_consent_forms_treatment_plan_id_fkey"
            columns: ["treatment_plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_documents: {
        Row: {
          category: string
          created_at: string
          file_url: string
          id: string
          notes: string | null
          patient_id: string
          title: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          file_url: string
          id?: string
          notes?: string | null
          patient_id: string
          title: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          file_url?: string
          id?: string
          notes?: string | null
          patient_id?: string
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_images: {
        Row: {
          created_at: string
          date_taken: string | null
          description: string | null
          id: string
          image_type: string
          image_url: string
          patient_id: string
          tooth_number: number | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          date_taken?: string | null
          description?: string | null
          id?: string
          image_type?: string
          image_url: string
          patient_id: string
          tooth_number?: number | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          date_taken?: string | null
          description?: string | null
          id?: string
          image_type?: string
          image_url?: string
          patient_id?: string
          tooth_number?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_images_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_reviews: {
        Row: {
          appointment_id: string | null
          comments: string | null
          created_at: string
          dentist_id: string | null
          id: string
          patient_id: string
          rating: number
          recorded_by: string | null
          service_categories: string[] | null
        }
        Insert: {
          appointment_id?: string | null
          comments?: string | null
          created_at?: string
          dentist_id?: string | null
          id?: string
          patient_id: string
          rating: number
          recorded_by?: string | null
          service_categories?: string[] | null
        }
        Update: {
          appointment_id?: string | null
          comments?: string | null
          created_at?: string
          dentist_id?: string | null
          id?: string
          patient_id?: string
          rating?: number
          recorded_by?: string | null
          service_categories?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_reviews_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_reviews_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          allergies: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          medical_history: string | null
          phone: string
          referral_source: string | null
          registered_date: string
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          medical_history?: string | null
          phone?: string
          referral_source?: string | null
          registered_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          allergies?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          medical_history?: string | null
          phone?: string
          referral_source?: string | null
          registered_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          payment_date: string
          payment_method: string
          reference: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id: string
          payment_date?: string
          payment_method?: string
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          payment_date?: string
          payment_method?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_medications: {
        Row: {
          created_at: string
          dosage: string
          duration: string
          frequency: string
          id: string
          name: string
          prescription_id: string
        }
        Insert: {
          created_at?: string
          dosage?: string
          duration?: string
          frequency?: string
          id?: string
          name: string
          prescription_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          duration?: string
          frequency?: string
          id?: string
          name?: string
          prescription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_medications_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          dentist_id: string
          diagnosis: string | null
          id: string
          notes: string | null
          patient_id: string
          prescription_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dentist_id: string
          diagnosis?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          prescription_date?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dentist_id?: string
          diagnosis?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          prescription_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recurring_appointment_rules: {
        Row: {
          chair: string | null
          created_at: string
          created_by: string | null
          day_of_week: number | null
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean
          notes: string | null
          occurrences: number | null
          patient_id: string
          staff_id: string
          treatment_id: string | null
        }
        Insert: {
          chair?: string | null
          created_at?: string
          created_by?: string | null
          day_of_week?: number | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          occurrences?: number | null
          patient_id: string
          staff_id: string
          treatment_id?: string | null
        }
        Update: {
          chair?: string | null
          created_at?: string
          created_by?: string | null
          day_of_week?: number | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          occurrences?: number | null
          patient_id?: string
          staff_id?: string
          treatment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_appointment_rules_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_appointment_rules_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_appointment_rules_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_fees: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          payment_date: string
          payment_method: string | null
          recorded_by: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          payment_date?: string
          payment_method?: string | null
          recorded_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          payment_date?: string
          payment_method?: string | null
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registration_fees_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_allocation_rules: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          percentage: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_active?: boolean
          percentage?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          percentage?: number
          updated_at?: string
        }
        Relationships: []
      }
      revenue_allocations: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          payment_id: string
          percentage: number
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          id?: string
          payment_id: string
          percentage: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          payment_id?: string
          percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "revenue_allocations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: string
          specialty: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          role?: string
          specialty?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
          specialty?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      staff_allocation_rules: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          percentage: number
          role_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          percentage?: number
          role_title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          percentage?: number
          role_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_revenue_allocations: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_id: string
          percentage: number
          role_title: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          payment_id: string
          percentage: number
          role_title: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_id?: string
          percentage?: number
          role_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_revenue_allocations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_plan_procedures: {
        Row: {
          completed_date: string | null
          created_at: string
          estimated_cost: number | null
          id: string
          plan_id: string
          procedure_name: string
          status: string
          tooth_number: number | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          plan_id: string
          procedure_name: string
          status?: string
          tooth_number?: number | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          plan_id?: string
          procedure_name?: string
          status?: string
          tooth_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plan_procedures_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_plans: {
        Row: {
          consent_date: string | null
          consent_status: string | null
          created_at: string
          estimated_end: string | null
          id: string
          name: string
          paid_amount: number
          patient_id: string
          start_date: string
          status: string
          total_cost: number
          updated_at: string
        }
        Insert: {
          consent_date?: string | null
          consent_status?: string | null
          created_at?: string
          estimated_end?: string | null
          id?: string
          name: string
          paid_amount?: number
          patient_id: string
          start_date?: string
          status?: string
          total_cost?: number
          updated_at?: string
        }
        Update: {
          consent_date?: string | null
          consent_status?: string | null
          created_at?: string
          estimated_end?: string | null
          id?: string
          name?: string
          paid_amount?: number
          patient_id?: string
          start_date?: string
          status?: string
          total_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration: string | null
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      war_chest_entries: {
        Row: {
          created_at: string
          excess_amount: number
          id: string
          payment_id: string
        }
        Insert: {
          created_at?: string
          excess_amount?: number
          id?: string
          payment_id: string
        }
        Update: {
          created_at?: string
          excess_amount?: number
          id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "war_chest_entries_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
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
      is_message_recipient: {
        Args: { _message_id: string; _user_id: string }
        Returns: boolean
      }
      is_message_sender: {
        Args: { _message_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "dentist"
        | "assistant"
        | "hygienist"
        | "receptionist"
        | "accountant"
        | "lab_technician"
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
      app_role: [
        "admin",
        "dentist",
        "assistant",
        "hygienist",
        "receptionist",
        "accountant",
        "lab_technician",
      ],
    },
  },
} as const

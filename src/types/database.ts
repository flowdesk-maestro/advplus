export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      law_offices: {
        Row: {
          id: string
          name: string
          cnpj: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          cnpj?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          cnpj?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          law_office_id: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          law_office_id?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          law_office_id?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      monitored_oabs: {
        Row: {
          id: string
          law_office_id: string
          user_id: string | null
          oab_number: string
          state: string
          active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          law_office_id: string
          user_id?: string | null
          oab_number: string
          state: string
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          law_office_id?: string
          user_id?: string | null
          oab_number?: string
          state?: string
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      publications: {
        Row: {
          id: string
          law_office_id: string
          oab_id: string | null
          process_number: string
          tribunal: string | null
          content: string
          published_at: string
          read: boolean | null
          urgency_level: string | null
          created_at: string
        }
        Insert: {
          id?: string
          law_office_id: string
          oab_id?: string | null
          process_number: string
          tribunal?: string | null
          content: string
          published_at: string
          read?: boolean | null
          urgency_level?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          law_office_id?: string
          oab_id?: string | null
          process_number?: string
          tribunal?: string | null
          content?: string
          published_at?: string
          read?: boolean | null
          urgency_level?: string | null
          created_at?: string
        }
      }
      ai_analysis: {
        Row: {
          id: string
          publication_id: string
          resumo: string | null
          prazo_dias: number | null
          classificacao: string | null
          providencia: string | null
          urgente: boolean | null
          analyzed_at: string
        }
        Insert: {
          id?: string
          publication_id: string
          resumo?: string | null
          prazo_dias?: number | null
          classificacao?: string | null
          providencia?: string | null
          urgente?: boolean | null
          analyzed_at?: string
        }
        Update: {
          id?: string
          publication_id?: string
          resumo?: string | null
          prazo_dias?: number | null
          classificacao?: string | null
          providencia?: string | null
          urgente?: boolean | null
          analyzed_at?: string
        }
      }
      telegram_integrations: {
        Row: {
          id: string
          user_id: string
          bot_token: string | null
          chat_id: string | null
          active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bot_token?: string | null
          chat_id?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bot_token?: string | null
          chat_id?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      openai_configs: {
        Row: {
          id: string
          law_office_id: string
          api_key: string | null
          model: string | null
          active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          law_office_id: string
          api_key?: string | null
          model?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          law_office_id?: string
          api_key?: string | null
          model?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

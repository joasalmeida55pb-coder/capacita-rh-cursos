// Tipos do schema `public` do Supabase (projeto "Conecta RH cursos").
// Escritos à mão a partir do schema atual. Para regenerar automaticamente:
//   npx supabase gen types typescript --project-id imvglkxavgjyaqrkidys > src/lib/supabase/database.types.ts
// (mantenha também o tipo `InsightsResumo` abaixo, que a CLI não gera).

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Tabela<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      perfis_cidadao: Tabela<
        {
          id: string;
          nome: string;
          cpf: string | null;
          area_interesse: string | null;
          disponibilidade: string | null;
          prontidao_estimada: number | null;
          competencias_verificadas: Json | null;
          created_at: string | null;
          user_id: string | null;
        },
        {
          id: string;
          nome: string;
          cpf?: string | null;
          area_interesse?: string | null;
          disponibilidade?: string | null;
          prontidao_estimada?: number | null;
          competencias_verificadas?: Json | null;
          created_at?: string | null;
          user_id?: string | null;
        }
      >;
      trilhas: Tabela<
        {
          id: string;
          titulo: string;
          setor: string;
          descricao: string | null;
          competencia_alvo: string;
          duracao_horas: number | null;
          ativa: boolean | null;
          created_at: string | null;
        },
        {
          id?: string;
          titulo: string;
          setor: string;
          descricao?: string | null;
          competencia_alvo: string;
          duracao_horas?: number | null;
          ativa?: boolean | null;
          created_at?: string | null;
        }
      >;
      matriculas_trilhas: Tabela<
        {
          id: string;
          cidadao_id: string | null;
          trilha_id: string | null;
          progresso: number | null;
          status: string | null;
          data_conclusao: string | null;
          certificado_codigo: string | null;
          created_at: string | null;
        },
        {
          id?: string;
          cidadao_id?: string | null;
          trilha_id?: string | null;
          progresso?: number | null;
          status?: string | null;
          data_conclusao?: string | null;
          certificado_codigo?: string | null;
          created_at?: string | null;
        }
      >;
      demandas_empresa: Tabela<
        {
          id: string;
          empresa_id: string | null;
          cargo: string;
          quantidade_vagas: number;
          prazo_dias: number | null;
          periodo_sazonal: string | null;
          competencias_requeridas: Json | null;
          created_at: string | null;
          owner_id: string | null;
        },
        {
          id?: string;
          empresa_id?: string | null;
          cargo: string;
          quantidade_vagas: number;
          prazo_dias?: number | null;
          periodo_sazonal?: string | null;
          competencias_requeridas?: Json | null;
          created_at?: string | null;
          owner_id?: string | null;
        }
      >;
      colaboradores_equipe: Tabela<
        {
          id: string;
          empresa_id: string | null;
          nome: string;
          funcao: string;
          equipe_unidade: string | null;
          trilhas_atribuidas: Json | null;
          created_at: string | null;
          owner_id: string | null;
        },
        {
          id?: string;
          empresa_id?: string | null;
          nome: string;
          funcao: string;
          equipe_unidade?: string | null;
          trilhas_atribuidas?: Json | null;
          created_at?: string | null;
          owner_id?: string | null;
        }
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      insights_resumo: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

export type Linha<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

/** Formato do jsonb devolvido por `public.insights_resumo()` */
export interface InsightsResumo {
  total_cidadaos: number;
  /** null enquanto houver menos de 5 perfis (proteção contra reidentificação) */
  prontidao_media: number | null;
  trilhas_ativas: number;
  total_matriculas: number;
  total_concluidas: number;
  vagas_demandadas: number;
  /** Só áreas com 5+ cidadãos */
  cidadaos_por_area: { area: string; total: number }[];
  demanda_por_cargo: { cargo: string; vagas: number; empresas: number }[];
  demanda_por_periodo: { periodo: string; vagas: number }[];
  matriculas_por_trilha: {
    trilha_id: string;
    titulo: string;
    setor: string;
    matriculas: number;
    concluidas: number;
    progresso_medio: number | null;
  }[];
  atualizado_em: string;
}

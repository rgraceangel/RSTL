/**
 * Hand-authored to mirror supabase/migrations exactly. Regenerate with:
 *
 *   npx supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
 *
 * Note: role/status/type columns are modeled here as literal unions for
 * better DX in app code. The real Supabase CLI generator would emit `string`
 * for these since they are `check` constraints rather than native Postgres
 * enum types -- consider migrating to enums later if you want the generator
 * to produce the same literal types automatically.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdminRole = "super_admin" | "admin" | "moderator";
export type GameType =
  | "quiz"
  | "spin_wheel"
  | "claw_machine"
  | "scratch_card"
  | "slot_machine"
  | "decoder"
  | "guess_the_gibberish"
  | "name_it_to_win_it"
  | "logo_challenge"
  | "chemical_symbol_challenge"
  | "true_or_false"
  | "guess_the_unit"
  | "measurement_challenge"
  | "equipment_match"
  | "which_laboratory"
  | "hazard_symbol"
  | "odd_one_out"
  | "word_scramble"
  | "emoji_science"
  | "picture_puzzle"
  | "memory_challenge"
  | "spot_the_difference"
  | "ppe_challenge"
  | "calibration_challenge"
  | "science_bingo"
  | "science_facts"
  | "mini_crossword"
  | "wheel_of_science_facts";
export type GameStatus = "draft" | "active" | "paused" | "archived";
export type QuestionType = "multiple_choice" | "true_false" | "text";
export type ImageType = "banner" | "thumbnail" | "question" | "background" | "icon";
export type PrizeType = "physical" | "digital" | "voucher" | "points";
export type SessionStatus = "in_progress" | "completed" | "abandoned";
export type WinnerStatus = "pending" | "claimed" | "expired" | "cancelled";

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          role: AdminRole;
          avatar_url: string | null;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          email: string;
          role?: AdminRole;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admins"]["Insert"]>;
        Relationships: [];
      };
      games: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          game_type: GameType;
          status: GameStatus;
          thumbnail_url: string | null;
          max_attempts_per_user: number;
          config: Json;
          start_date: string | null;
          end_date: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          game_type: GameType;
          status?: GameStatus;
          thumbnail_url?: string | null;
          max_attempts_per_user?: number;
          config?: Json;
          start_date?: string | null;
          end_date?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
        Relationships: [];
      };
      game_questions: {
        Row: {
          id: string;
          game_id: string;
          question_text: string;
          question_type: QuestionType;
          options: Json;
          correct_answer: string;
          explanation: string | null;
          points: number;
          order_index: number;
          time_limit_seconds: number;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          question_text: string;
          question_type?: QuestionType;
          options?: Json;
          correct_answer: string;
          explanation?: string | null;
          points?: number;
          order_index?: number;
          time_limit_seconds?: number;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["game_questions"]["Insert"]>;
        Relationships: [];
      };
      game_images: {
        Row: {
          id: string;
          game_id: string;
          question_id: string | null;
          image_url: string;
          image_type: ImageType;
          alt_text: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          question_id?: string | null;
          image_url: string;
          image_type?: ImageType;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["game_images"]["Insert"]>;
        Relationships: [];
      };
      prizes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          prize_type: PrizeType;
          value: number;
          probability_weight: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          prize_type?: PrizeType;
          value?: number;
          probability_weight?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prizes"]["Insert"]>;
        Relationships: [];
      };
      prize_inventory: {
        Row: {
          id: string;
          prize_id: string;
          quantity_total: number;
          quantity_awarded: number;
          quantity_available: number;
          low_stock_threshold: number;
          last_restocked_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          prize_id: string;
          quantity_total?: number;
          quantity_awarded?: number;
          low_stock_threshold?: number;
          last_restocked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prize_inventory"]["Insert"]>;
        Relationships: [];
      };
      game_sessions: {
        Row: {
          id: string;
          game_id: string;
          player_id: string | null;
          player_name: string | null;
          status: SessionStatus;
          score: number;
          answer_correct: boolean | null;
          started_at: string;
          ended_at: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          player_id?: string | null;
          player_name?: string | null;
          status?: SessionStatus;
          score?: number;
          answer_correct?: boolean | null;
          started_at?: string;
          ended_at?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["game_sessions"]["Insert"]>;
        Relationships: [];
      };
      winner_records: {
        Row: {
          id: string;
          game_session_id: string;
          game_id: string;
          prize_id: string;
          player_name: string | null;
          player_contact: string | null;
          status: WinnerStatus;
          won_at: string;
          claimed_at: string | null;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          game_session_id: string;
          game_id: string;
          prize_id: string;
          player_name?: string | null;
          player_contact?: string | null;
          status?: WinnerStatus;
          won_at?: string;
          claimed_at?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["winner_records"]["Insert"]>;
        Relationships: [];
      };
      analytics: {
        Row: {
          id: string;
          game_id: string | null;
          metric_name: string;
          metric_value: number;
          dimensions: Json;
          recorded_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          game_id?: string | null;
          metric_name: string;
          metric_value?: number;
          dimensions?: Json;
          recorded_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["analytics"]["Insert"]>;
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Insert"]>;
        Relationships: [];
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          is_public: boolean;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          is_public?: boolean;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      game_questions_public: {
        Row: {
          id: string;
          game_id: string;
          question_text: string;
          question_type: QuestionType;
          options: Json;
          points: number;
          order_index: number;
          time_limit_seconds: number;
          category: string | null;
          image_url: string | null;
          created_at: string;
        };
        Relationships: [];
      };
      recent_winners_feed: {
        Row: {
          id: string;
          game_name: string;
          prize_name: string;
          player_display: string;
          won_at: string;
        };
        Relationships: [];
      };
      available_prizes_for_wheel: {
        Row: {
          id: string;
          name: string;
          image_url: string | null;
          prize_type: PrizeType;
          probability_weight: number;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      record_admin_login: {
        Args: Record<string, never>;
        Returns: undefined;
      };
      move_game_question: {
        Args: { p_question_id: string; p_direction: string };
        Returns: undefined;
      };
      check_quiz_answer: {
        Args: { p_question_id: string; p_submitted_answer: string };
        Returns: {
          is_correct: boolean;
          correct_answer: string;
          question_type: string;
          explanation: string | null;
          points: number;
        }[];
      };
      claim_prize_win: {
        Args: { p_winner_record_id: string; p_player_name: string; p_player_contact: string };
        Returns: undefined;
      };
      get_games_played_summary: {
        Args: Record<string, never>;
        Returns: {
          total_sessions: number;
          completed_sessions: number;
          in_progress_sessions: number;
          abandoned_sessions: number;
          sessions_today: number;
          sessions_last_7_days: number;
        }[];
      };
      get_answer_accuracy_summary: {
        Args: Record<string, never>;
        Returns: {
          correct_answers: number;
          incorrect_answers: number;
          accuracy_rate: number;
        }[];
      };
      get_prize_claim_summary: {
        Args: Record<string, never>;
        Returns: {
          total_won: number;
          claimed: number;
          pending: number;
          expired: number;
          cancelled: number;
          claim_rate: number;
        }[];
      };
      get_prize_inventory_report: {
        Args: Record<string, never>;
        Returns: {
          prize_id: string;
          prize_name: string;
          prize_type: PrizeType;
          is_active: boolean;
          quantity_total: number;
          quantity_awarded: number;
          quantity_available: number;
          low_stock_threshold: number;
        }[];
      };
      get_most_popular_games: {
        Args: { p_limit?: number };
        Returns: {
          game_id: string;
          game_name: string;
          game_type: GameType;
          sessions_count: number;
          win_count: number;
        }[];
      };
      get_daily_participation: {
        Args: { p_days?: number };
        Returns: {
          day: string;
          sessions_count: number;
          completed_count: number;
          winners_count: number;
        }[];
      };
      restock_prize: {
        Args: { p_prize_id: string; p_amount: number };
        Returns: { quantity_total: number }[];
      };
    };
    Enums: Record<string, never>;
  };
}

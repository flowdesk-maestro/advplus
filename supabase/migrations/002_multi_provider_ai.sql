-- Migração para suporte a múltiplos provedores de IA
ALTER TABLE IF EXISTS openai_configs RENAME TO ai_configs;
ALTER TABLE ai_configs ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'openai';
ALTER TABLE ai_configs ADD COLUMN IF NOT EXISTS base_url TEXT;

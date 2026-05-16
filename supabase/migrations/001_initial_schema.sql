-- Habilitar a extensão uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Escritórios (Multi-tenant)
CREATE TABLE law_offices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Usuários (Perfil)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    law_office_id UUID REFERENCES law_offices(id) ON DELETE SET NULL,
    role TEXT DEFAULT 'admin', -- 'admin', 'lawyer', 'assistant'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. OABs Monitoradas
CREATE TABLE monitored_oabs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    law_office_id UUID NOT NULL REFERENCES law_offices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    oab_number TEXT NOT NULL,
    state CHAR(2) NOT NULL, -- Ex: SP, RJ, etc.
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(law_office_id, oab_number, state)
);

-- 4. Publicações
CREATE TABLE publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    law_office_id UUID NOT NULL REFERENCES law_offices(id) ON DELETE CASCADE,
    oab_id UUID REFERENCES monitored_oabs(id) ON DELETE SET NULL,
    process_number TEXT NOT NULL,
    tribunal TEXT,
    content TEXT NOT NULL,
    published_at DATE NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    urgency_level TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Análise de IA
CREATE TABLE ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    resumo TEXT,
    prazo_dias INTEGER,
    classificacao TEXT, -- 'urgente', 'manifestação', 'audiência', 'ciência', 'despacho', 'sentença'
    providencia TEXT,
    urgente BOOLEAN DEFAULT FALSE,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Prazos (Deadlines)
CREATE TABLE deadlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    law_office_id UUID NOT NULL REFERENCES law_offices(id) ON DELETE CASCADE,
    publication_id UUID REFERENCES publications(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id),
    deadline_date DATE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'missed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Integração Telegram
CREATE TABLE telegram_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bot_token TEXT,
    chat_id TEXT,
    active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 8. Configuração OpenAI (Por Escritório ou Usuário - aqui por escritório para IA compartilhada)
CREATE TABLE openai_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    law_office_id UUID NOT NULL REFERENCES law_offices(id) ON DELETE CASCADE,
    api_key TEXT,
    model TEXT DEFAULT 'gpt-4o',
    active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(law_office_id)
);

-- 9. Notificações (Log)
CREATE TABLE notifications_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    publication_id UUID REFERENCES publications(id),
    channel TEXT NOT NULL, -- 'telegram', 'email'
    status TEXT NOT NULL, -- 'sent', 'failed'
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE law_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_oabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE openai_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

-- Exemplo de política para law_offices
CREATE POLICY "Users can see their own law office" ON law_offices
    FOR SELECT USING (id IN (SELECT law_office_id FROM users WHERE users.id = auth.uid()));

-- Política para monitored_oabs
CREATE POLICY "Users can see their law office's OABs" ON monitored_oabs
    FOR ALL USING (law_office_id IN (SELECT law_office_id FROM users WHERE users.id = auth.uid()));

-- Política para publications
CREATE POLICY "Users can see their law office's publications" ON publications
    FOR ALL USING (law_office_id IN (SELECT law_office_id FROM users WHERE users.id = auth.uid()));

-- Política para ai_analysis
CREATE POLICY "Users can see their law office's AI analysis" ON ai_analysis
    FOR SELECT USING (publication_id IN (SELECT id FROM publications WHERE law_office_id IN (SELECT law_office_id FROM users WHERE users.id = auth.uid())));

-- Política para telegram_integrations
CREATE POLICY "Users can manage their own telegram config" ON telegram_integrations
    FOR ALL USING (user_id = auth.uid());

-- Política para openai_configs
CREATE POLICY "Admins can manage their law office's openai config" ON openai_configs
    FOR ALL USING (law_office_id IN (SELECT law_office_id FROM users WHERE users.id = auth.uid()));

-- Índices para performance
CREATE INDEX idx_publications_law_office ON publications(law_office_id);
CREATE INDEX idx_publications_oab ON publications(oab_id);
CREATE INDEX idx_monitored_oabs_law_office ON monitored_oabs(law_office_id);
CREATE INDEX idx_deadlines_law_office ON deadlines(law_office_id);
CREATE INDEX idx_deadlines_user ON deadlines(user_id);

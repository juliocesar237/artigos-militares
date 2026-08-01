const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl:
        process.env.PGSSL === 'true'
            ? { rejectUnauthorized: false }
            : false
});

async function criarTabelas() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id BIGSERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha_hash TEXT NOT NULL,
                telefone TEXT,
                patente TEXT,
                administrador BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id BIGSERIAL PRIMARY KEY,
                titulo TEXT NOT NULL,
                descricao TEXT,
                categoria TEXT NOT NULL,
                patente TEXT,
                preco NUMERIC(12, 2) NOT NULL DEFAULT 0,
                preco_promocional NUMERIC(12, 2),
                quantidade_minima_promo INTEGER DEFAULT 1,
                imagem TEXT,
                estoque INTEGER DEFAULT 0,
                personalizavel BOOLEAN DEFAULT FALSE,
                tamanho BOOLEAN DEFAULT TRUE,
                ativo BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id BIGSERIAL PRIMARY KEY,
                usuario_id BIGINT,
                status TEXT DEFAULT 'pendente',
                forma_pagamento TEXT,
                total_pix NUMERIC(12, 2),
                total_cartao NUMERIC(12, 2),
                batalhao TEXT,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_pedidos_usuario
                    FOREIGN KEY (usuario_id)
                    REFERENCES usuarios(id)
                    ON DELETE SET NULL
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS pedido_itens (
                id BIGSERIAL PRIMARY KEY,
                pedido_id BIGINT NOT NULL,
                produto_id BIGINT,
                quantidade INTEGER NOT NULL,
                tamanho TEXT,
                personalizacao TEXT,
                valor_unitario NUMERIC(12, 2) NOT NULL,

                CONSTRAINT fk_itens_pedido
                    FOREIGN KEY (pedido_id)
                    REFERENCES pedidos(id)
                    ON DELETE CASCADE,

                CONSTRAINT fk_itens_produto
                    FOREIGN KEY (produto_id)
                    REFERENCES produtos(id)
                    ON DELETE SET NULL
            )
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_produtos_ativo
            ON produtos (ativo)
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_produtos_categoria
            ON produtos (categoria)
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_produtos_patente
            ON produtos (patente)
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_pedidos_usuario
            ON pedidos (usuario_id)
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_pedido_itens_pedido
            ON pedido_itens (pedido_id)
        `);

        await client.query('COMMIT');

        console.log(
            '✅ Tabelas do PostgreSQL criadas/verificadas com sucesso.'
        );
    } catch (erro) {
        await client.query('ROLLBACK');

        console.error(
            '❌ Erro ao criar tabelas:',
            erro
        );

        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

criarTabelas();
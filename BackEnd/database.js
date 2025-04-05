const { Pool } = require('pg');
require('dotenv').config();

// Configuração do Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,  -- SERIAL = AUTOINCREMENT no PostgreSQL
        titulo TEXT NOT NULL,
        conteudo TEXT NOT NULL,
        data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- TIMESTAMP em vez de TEXT
        categoria TEXT,
        resumo TEXT,
        imagem TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        author_name TEXT,
        text TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL UNIQUE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts_tags (
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        token TEXT NOT NULL UNIQUE,
        user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query("CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token)");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id)");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at)");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id)");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_posts_tags_post ON posts_tags(post_id)");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_posts_tags_tag ON posts_tags(tag_id)");

    console.log("✅ Tabelas criadas/verificadas com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao criar tabelas:", err);
  }
}

pool.connect((err, client, done) => {
  if (err) {
    console.error("Erro ao conectar ao PostgreSQL:", err);
  } else {
    console.log("Banco de dados PostgreSQL conectado!");
    client.query("SELECT NOW()", (err, res) => {
      done();
      if (err) {
        console.error("Erro ao testar a conexão:", err);
      } else {
        console.log("Teste de conexão OK. Hora atual do banco:", res.rows[0].now);
        createTables();
      }
    });
  }
});

module.exports = pool;
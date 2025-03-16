const sqlite3 = require("sqlite3").verbose();

// Criar conexão com o banco de dados
const db = new sqlite3.Database("./blog.db", (err) => {
  if (err) {
    console.error("Erro ao abrir o banco de dados", err);
  } else {
    console.log("Banco de dados conectado!");

    // Criar as tabelas no banco (apenas se não existirem)
    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        conteudo TEXT NOT NULL,
        data TEXT DEFAULT CURRENT_TIMESTAMP,
        categoria TEXT,
        resumo TEXT,
        imagem TEXT 
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        author_name TEXT,
        text TEXT NOT NULL,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(post_id) REFERENCES posts(id)
      )
    `);

    // Nova tabela de tags
    db.run(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
      )
    `);

    // Nova tabela de relacionamento posts_tags
    db.run(`
      CREATE TABLE IF NOT EXISTS posts_tags (
        post_id INTEGER,
        tag_id INTEGER,
        FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY(post_id, tag_id)
      )
    `);
      // Nova tabela para Newsletter
    db.run(`
      CREATE TABLE IF NOT EXISTS newsletter (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL
      )
    `);

    console.log("Tabelas criadas com sucesso!");
  }
});

module.exports = db;
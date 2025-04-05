require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { Pool } = require('pg');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Configuração do PostgreSQL (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Rota para upload de imagens
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: "Nenhum arquivo enviado" });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ location: imageUrl });
});

// Middleware de autenticação
const verificaToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          erro: "Token expirado",
          code: "TOKEN_EXPIRED"
        });
      }
      return res.status(401).json({ erro: "Token inválido" });
    }
    req.userId = decoded.id;
    next();
  });
};

// Rota para verificar token
app.get("/auth/verify", verificaToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nome, email FROM usuarios WHERE id = $1", [req.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json({ autenticado: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota protegida do painel admin
app.get("/admin", verificaToken, (req, res) => {
  res.json({ mensagem: "Painel administrativo acessado com sucesso!" });
});

// Rota para criar comentário
app.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { text, author_name } = req.body;

  if (!text) {
    return res.status(400).json({ erro: "Texto do comentário é obrigatório" });
  }

  try {
    const postResult = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ erro: "Post não encontrado" });
    }

    const author = author_name ? author_name : "Anônimo";
    const date = new Date().toISOString();

    const insertResult = await pool.query(
      "INSERT INTO comments (post_id, author_name, text, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, author, text, date]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para listar comentários de um post
app.get("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY date DESC", 
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("API do blog funcionando! 🚀");
});

// Rota para listar posts com busca
app.get("/posts", async (req, res) => {
  const { page = 1, limit = 6, categoria, q } = req.query;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM posts";
  let countQuery = "SELECT COUNT(*) AS total FROM posts";
  let params = [];
  let conditions = [];

  if (categoria) {
    conditions.push("categoria = $1");
    params.push(categoria);
  }

  if (q) {
    conditions.push("(titulo LIKE $1 OR resumo LIKE $1 OR categoria LIKE $1)");
    params.push(`%${q}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
    countQuery += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY data DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2);
  params.push(limit, offset);

  try {
    const countResult = await pool.query(countQuery, params.slice(0, conditions.length));
    const totalPosts = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalPosts / limit);

    const postsResult = await pool.query(query, params);
    
    // Buscar tags para cada post
    const postsWithTags = await Promise.all(postsResult.rows.map(async (post) => {
      const tagsResult = await pool.query(
        `SELECT t.nome 
         FROM tags t
         INNER JOIN posts_tags pt ON t.id = pt.tag_id
         WHERE pt.post_id = $1`, 
        [post.id]
      );
      return {
        ...post,
        tags: tagsResult.rows.map(tag => tag.nome)
      };
    }));

    res.json({
      totalPosts,
      totalPages,
      currentPage: parseInt(page),
      posts: postsWithTags,
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para obter um post específico
app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const postResult = await pool.query(
      `SELECT 
          id, 
          titulo, 
          conteudo, 
          categoria, 
          resumo, 
          imagem, 
          data 
      FROM posts 
      WHERE id = $1`, 
      [id]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ erro: "Post não encontrado" });
    }

    const post = postResult.rows[0];
    
    // Busca as tags do post
    const tagsResult = await pool.query(
      `SELECT t.nome 
       FROM tags t
       INNER JOIN posts_tags pt ON t.id = pt.tag_id
       WHERE pt.post_id = $1`, 
      [id]
    );

    res.json({ 
      ...post, 
      tags: tagsResult.rows.map(tag => tag.nome) 
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para criar post
app.post("/posts", verificaToken, upload.single("imagem"), async (req, res) => {
  const { titulo, conteudo, categoria, resumo, tags } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;

  if (!titulo || !conteudo || !categoria || !resumo || !imagem) {
    return res.status(400).json({ erro: "Todos os campos (titulo, conteudo, categoria, resumo e imagem) são obrigatórios" });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insere o post
    const postResult = await client.query(
      "INSERT INTO posts (titulo, conteudo, categoria, resumo, imagem) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [titulo, conteudo, categoria, resumo, imagem]
    );
    const postId = postResult.rows[0].id;

    // Processa as tags se existirem
    let tagsArray = [];
    if (tags) {
      try {
        tagsArray = JSON.parse(tags);
      } catch {
        tagsArray = tags.split(",").map(tag => tag.trim());
      }

      for (const tagNome of tagsArray) {
        // Verifica se a tag já existe
        let tagResult = await client.query("SELECT id FROM tags WHERE nome = $1", [tagNome]);
        let tagId = tagResult.rows[0]?.id;

        // Se a tag não existe, cria
        if (!tagId) {
          tagResult = await client.query("INSERT INTO tags (nome) VALUES ($1) RETURNING id", [tagNome]);
          tagId = tagResult.rows[0].id;
        }

        // Associa a tag ao post
        await client.query("INSERT INTO posts_tags (post_id, tag_id) VALUES ($1, $2)", [postId, tagId]);
      }
    }

    await client.query('COMMIT');
    
    res.json({
      id: postId,
      titulo,
      conteudo,
      categoria,
      resumo,
      imagem,
      tags: tagsArray,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ erro: error.message });
  } finally {
    client.release();
  }
});

// Rota para cadastro
app.post("/register", async (req, res) => { 
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  try {
    // Verifica se o email já existe
    const userResult = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const insertResult = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, senhaHash]
    );

    res.json(insertResult.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  try {
    const userResult = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    const user = userResult.rows[0];
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(400).json({ erro: "Senha incorreta" });
    }

    // Gerar access token (15 minutos)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    // Gerar refresh token (7 dias)
    const refreshToken = jwt.sign(
      { id: user.id }, 
      process.env.JWT_REFRESH_SECRET, 
      { expiresIn: '7d' }
    );

    // Armazenar o refresh token no banco de dados
    await pool.query(
      "INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')",
      [refreshToken, user.id]
    );

    res.json({ 
      accessToken, 
      refreshToken,
      nome: user.nome, 
      email: user.email,
      expiresIn: 900 // 15 minutos em segundos
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para obter novo access token usando refresh token
app.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ erro: "Refresh token é obrigatório" });
  }

  try {
    // Verificar se o refresh token existe e é válido
    const tokenResult = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({ erro: "Refresh token inválido ou expirado" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Gerar novo access token
    const newAccessToken = jwt.sign(
      { id: decoded.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    res.json({ 
      accessToken: newAccessToken,
      expiresIn: 900
    });
  } catch (error) {
    res.status(401).json({ erro: "Refresh token inválido" });
  }
});

// Rota para logout (invalidar refresh token)
app.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ erro: "Refresh token é obrigatório" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM refresh_tokens WHERE token = $1",
      [refreshToken]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Refresh token não encontrado" });
    }

    res.json({ mensagem: "Logout realizado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para atualização do post
app.put("/posts/:id", verificaToken, upload.single("imagem"), async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo, categoria, resumo, tags } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;

  if (!titulo || !conteudo || !categoria || !resumo) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios: título, conteúdo, categoria e resumo" });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Busca o post atual para obter a imagem antiga
    const postResult = await client.query("SELECT imagem FROM posts WHERE id = $1", [id]);
    if (postResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ erro: "Post não encontrado" });
    }

    const caminhoImagem = imagem || postResult.rows[0].imagem;

    // Atualiza o post
    await client.query(
      "UPDATE posts SET titulo = $1, conteudo = $2, categoria = $3, resumo = $4, imagem = $5 WHERE id = $6",
      [titulo, conteudo, categoria, resumo, caminhoImagem, id]
    );

    // Remove as tags antigas
    await client.query("DELETE FROM posts_tags WHERE post_id = $1", [id]);

    // Processa as novas tags se existirem
    let tagsArray = [];
    if (tags) {
      try {
        tagsArray = JSON.parse(tags);
      } catch {
        tagsArray = tags.split(",").map(tag => tag.trim());
      }

      for (const tagNome of tagsArray) {
        // Verifica se a tag já existe
        let tagResult = await client.query("SELECT id FROM tags WHERE nome = $1", [tagNome]);
        let tagId = tagResult.rows[0]?.id;

        // Se a tag não existe, cria
        if (!tagId) {
          tagResult = await client.query("INSERT INTO tags (nome) VALUES ($1) RETURNING id", [tagNome]);
          tagId = tagResult.rows[0].id;
        }

        // Associa a tag ao post
        await client.query("INSERT INTO posts_tags (post_id, tag_id) VALUES ($1, $2)", [id, tagId]);
      }
    }

    await client.query('COMMIT');
    
    res.json({ 
      id, 
      titulo, 
      conteudo, 
      categoria, 
      resumo, 
      imagem: caminhoImagem, 
      tags: tagsArray 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ erro: error.message });
  } finally {
    client.release();
  }
});

// Rota para excluir post
app.delete("/posts/:id", verificaToken, async (req, res) => {
  const { id } = req.params;

  try {
    const postResult = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ erro: "Post não encontrado" });
    }

    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.json({ mensagem: "Post excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para buscar categorias únicas
app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT categoria FROM posts");
    const categories = result.rows.map(row => row.categoria);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para o Newsletter
app.post("/newsletter", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ erro: "Email é obrigatório" });
  }

  try {
    await pool.query(
      "INSERT INTO newsletter (email) VALUES ($1)",
      [email]
    );
    res.json({ mensagem: "Inscrição realizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para listar e-mails da newsletter
app.get("/newsletter", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM newsletter");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Rota para contato
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Envia um e-mail de confirmação
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmação de contato - Keeg Club',
      text: `Olá ${name},\n\nObrigado por entrar em contato! Recebemos sua mensagem sobre "${subject}" e responderemos em breve.\n\nAtenciosamente,\nEquipe Keeg Club`,
    });

    // Envia um e-mail para você com a mensagem do usuário
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nova mensagem de ${name}: ${subject}`,
      text: `De: ${name} (${email})\n\nMensagem:\n${message}`,
    });

    res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ message: 'Erro ao enviar a mensagem.' });
  }
});

// Rota para listar todos os comentários (admin)
app.get("/comments", verificaToken, async (req, res) => {
  const { page = 1, limit = 10, q: searchTerm } = req.query;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM comments";
  let countQuery = "SELECT COUNT(*) AS total FROM comments";
  let params = [];
  let conditions = [];

  if (searchTerm) {
    conditions.push("(author_name LIKE $1 OR text LIKE $1)");
    params.push(`%${searchTerm}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
    countQuery += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY date DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2);
  params.push(limit, offset);

  try {
    const countResult = await pool.query(countQuery, params.slice(0, conditions.length));
    const commentsResult = await pool.query(query, params);

    res.json({
      comments: commentsResult.rows,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para excluir comentário (apenas admin)
app.delete("/comments/:id", verificaToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM comments WHERE id = $1", [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Comentário não encontrado" });
    }

    res.json({ mensagem: "Comentário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
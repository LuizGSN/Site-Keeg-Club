const express = require("express");
const cors = require("cors");
const db = require("./database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

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
  

// Rota de autenticação Middleware
const verificaToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ erro: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1]; // Pega apenas o token sem "Bearer"

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: "Token inválido" });
        }
        req.userId = decoded.id;
        next();
    });
};

// Rota para verificar se o token ainda é válido
app.get("/auth/verify", verificaToken, (req, res) => {
    res.json({ autenticado: true });
});

// Rota protegida do painel admin
app.get("/admin", verificaToken, (req, res) => {
    res.json({ mensagem: "Painel administrativo acessado com sucesso!" });
});

// Rota para criar comentário
app.post("/posts/:id/comments", (req, res) => {
    const { id } = req.params;
    const { text, author_name } = req.body;
  
    if (!text) {
      return res.status(400).json({ erro: "Texto do comentário é obrigatório" });
    }
  
    db.get("SELECT * FROM posts WHERE id = ?", [id], (err, post) => {
      if (!post) {
        return res.status(404).json({ erro: "Post não encontrado" });
      }
  
      const author = author_name ? author_name : "Anônimo";
      const date = new Date().toISOString();
  
      db.run(
        "INSERT INTO comments (post_id, author_name, text, date) VALUES (?, ?, ?, ?)",
        [id, author, text, date],
        function (err) {
          if (err) {
            return res.status(500).json({ erro: err.message });
          }
          res.status(201).json({
            id: this.lastID,
            post_id: id,
            author_name: author,
            text,
            date,
          });
        }
      );
    });
});

  // Rota para listar comentários de um post
  app.get("/posts/:id/comments", (req, res) => {
    const { id } = req.params;  // ID do post
    
    // Buscar todos os comentários do post
    db.all("SELECT * FROM comments WHERE post_id = ? ORDER BY date DESC", [id], (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res.json(rows);
    });
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("API do blog funcionando! 🚀");
});

// Rota para listar posts com busca
app.get("/posts", (req, res) => {
  const { page = 1, limit = 6, categoria, q } = req.query; // Adiciona o parâmetro de busca (q)
  const offset = (page - 1) * limit;

  // Monta a query SQL com base nos filtros
  let query = "SELECT * FROM posts";
  let params = [];
  let conditions = [];

  if (categoria) {
    conditions.push("categoria = ?");
    params.push(categoria);
  }

  if (q) {
    conditions.push("(titulo LIKE ? OR resumo LIKE ? OR categoria LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY data DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  // Conta o total de posts (com ou sem filtro)
  db.get("SELECT COUNT(*) AS total FROM posts" + (conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : ""), params.slice(0, conditions.length), (err, row) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    const totalPosts = row.total;
    const totalPages = Math.ceil(totalPosts / limit);

    // Busca os posts com base na query
    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      res.json({
        totalPosts,
        totalPages,
        currentPage: parseInt(page),
        posts: rows.map(post => ({
          id: post.id,
          titulo: post.titulo,
          conteudo: post.conteudo,
          categoria: post.categoria,
          resumo: post.resumo,
          imagem: post.imagem,
          data: post.data,
          tags: post.tags ? JSON.parse(post.tags) : [], // Converte a string de tags para array
        })),
      });
    });
  });
});

// Rota para obter um post específico
app.get("/posts/:id", (req, res) => {
    const { id } = req.params;

    db.get(
        `SELECT 
            id, 
            titulo, 
            conteudo, 
            categoria, 
            resumo, 
            imagem, 
            data 
        FROM posts 
        WHERE id = ?`, 
        [id], 
        async (err, post) => {
            if (err) {
                return res.status(500).json({ erro: "Erro ao buscar o post" });
            }

            if (!post) {
                return res.status(404).json({ erro: "Post não encontrado" });
            }

            // Busca as tags do post
            const tags = await new Promise((resolve, reject) => {
                db.all(
                    `SELECT t.nome 
                     FROM tags t
                     INNER JOIN posts_tags pt ON t.id = pt.tag_id
                     WHERE pt.post_id = ?`, 
                    [id], 
                    (err, tags) => {
                        if (err) reject(err);
                        else resolve(tags.map(tag => tag.nome));
                    }
                );
            });

            res.json({ ...post, tags });
        }
    );
});

// Rota para criar post
app.post("/posts", verificaToken, async (req, res) => {
    const { titulo, conteudo, categoria, resumo, imagem, tags } = req.body;

    if (!titulo || !conteudo || !categoria || !resumo || !imagem) {
        return res.status(400).json({ erro: "Todos os campos (titulo, conteudo, categoria, resumo e imagem) são obrigatórios" });
    }

    try {
        // Insere o post
        const { lastID: postId } = await new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO posts (titulo, conteudo, categoria, resumo, imagem) VALUES (?, ?, ?, ?, ?)",
                [titulo, conteudo, categoria, resumo, imagem],
                function (err) {
                    if (err) reject(err);
                    else resolve(this);
                }
            );
        });

        // Insere as tags (se houver)
        if (tags && tags.length > 0) {
            for (const tagNome of tags) {
                // Verifica se a tag já existe
                let tagId = await new Promise((resolve, reject) => {
                    db.get("SELECT id FROM tags WHERE nome = ?", [tagNome], (err, row) => {
                        if (err) reject(err);
                        else resolve(row ? row.id : null);
                    });
                });

                // Se a tag não existe, cria
                if (!tagId) {
                    tagId = await new Promise((resolve, reject) => {
                        db.run("INSERT INTO tags (nome) VALUES (?)", [tagNome], function (err) {
                            if (err) reject(err);
                            else resolve(this.lastID);
                        });
                    });
                }

                // Associa a tag ao post
                await new Promise((resolve, reject) => {
                    db.run("INSERT INTO posts_tags (post_id, tag_id) VALUES (?, ?)", [postId, tagId], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
        }

        res.json({
            id: postId,
            titulo,
            conteudo,
            categoria,
            resumo,
            imagem,
            tags
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Rota para cadastro
app.post("/register", async (req, res) => { 
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    db.get("SELECT * FROM usuarios WHERE email = ?", [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao verificar o email" });
        }

        if (user) {
            return res.status(400).json({ erro: "Email já cadastrado" });
        }

        try {
            const senhaHash = await bcrypt.hash(senha, 10);
            db.run(
                "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
                [nome, email, senhaHash],
                function (err) {
                    if (err) {
                        return res.status(500).json({ erro: err.message });
                    }
                    res.json({ id: this.lastID, nome, email });
                }
            );
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao processar a senha" });
        }
    });
});

// Rota de login
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    db.get("SELECT * FROM usuarios WHERE email = ?", [email], async (err, user) => {
        if (!user) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        // Comparar a senha informada com a senha criptografada do banco
        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(400).json({ erro: "Senha incorreta" });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET,);
        res.json({ token, nome: user.nome, email: user.email });
    });
});

// Rota para atualização do post
app.put("/posts/:id", verificaToken, async (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo, categoria, resumo, imagem, tags } = req.body;

    if (!titulo || !conteudo || !categoria || !resumo || !imagem) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios: título, conteúdo, categoria, resumo e imagem" });
    }

    try {
        // Atualiza o post
        await new Promise((resolve, reject) => {
            db.run(
                "UPDATE posts SET titulo = ?, conteudo = ?, categoria = ?, resumo = ?, imagem = ? WHERE id = ?",
                [titulo, conteudo, categoria, resumo, imagem, id],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        // Remove as tags antigas
        await new Promise((resolve, reject) => {
            db.run("DELETE FROM posts_tags WHERE post_id = ?", [id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Insere as novas tags (se houver)
        if (tags && tags.length > 0) {
            for (const tagNome of tags) {
                let tagId = await new Promise((resolve, reject) => {
                    db.get("SELECT id FROM tags WHERE nome = ?", [tagNome], (err, row) => {
                        if (err) reject(err);
                        else resolve(row ? row.id : null);
                    });
                });

                if (!tagId) {
                    tagId = await new Promise((resolve, reject) => {
                        db.run("INSERT INTO tags (nome) VALUES (?)", [tagNome], function (err) {
                            if (err) reject(err);
                            else resolve(this.lastID);
                        });
                    });
                }

                await new Promise((resolve, reject) => {
                    db.run("INSERT INTO posts_tags (post_id, tag_id) VALUES (?, ?)", [id, tagId], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
        }

        res.json({ id, titulo, conteudo, categoria, resumo, imagem, tags });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


// Rota para excluir post
app.delete("/posts/:id", verificaToken, (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM posts WHERE id = ?", [id], (err, post) => {
        if (!post) {
            return res.status(404).json({ erro: "Post não encontrado" });
        }

        db.run("DELETE FROM posts WHERE id = ?", [id], function (err) {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            res.json({ mensagem: "Post excluído com sucesso" });
        });
    });
});

// Rota para buscar categorias únicas
app.get("/categories", (req, res) => {
    db.all("SELECT DISTINCT categoria FROM posts", (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao buscar categorias" });
      }
      const categories = rows.map((row) => row.categoria);
      res.json(categories);
    });
  });

// Rota para o Newsletter
app.post("/newsletter", (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ erro: "Email é obrigatório" });
    }
  
    db.run(
      "INSERT INTO newsletter (email) VALUES (?)",
      [email],
      function (err) {
        if (err) {
          return res.status(500).json({ erro: "Erro ao salvar email" });
        }
        res.json({ mensagem: "Inscrição realizada com sucesso!" });
      }
    );
  });

// Rota para listar e-mails da newsletter
app.get("/newsletter", (req, res) => {
    db.all("SELECT * FROM newsletter", (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao buscar e-mails" });
      }
      res.json(rows);
    });
  });

  // Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
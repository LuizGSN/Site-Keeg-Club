import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../GlobalStyles";  // Certifique-se de que o tema está sendo importado

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${theme.colors.background};
  height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${theme.colors.text};
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  background-color: ${theme.colors.secondary};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid ${theme.colors.primary};
  border-radius: 4px;
  background-color: ${theme.colors.tertiary};
  color: ${theme.colors.text};
`;

const Textarea = styled.textarea`
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid ${theme.colors.primary};
  border-radius: 4px;
  background-color: ${theme.colors.tertiary};
  color: ${theme.colors.text};
  resize: vertical;
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

const CreatePost = () => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [resumo, setResumo] = useState("");
  const [imagem, setImagem] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !conteudo || !categoria || !resumo || !imagem) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3001/posts",
        {
          titulo,
          conteudo,
          categoria,
          resumo,
          imagem,
          tags: tags.split(",").map(tag => tag.trim()), // Converte a string de tags em um array
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Post criado:", response.data);
      navigate("/admin");
    } catch (err) {
      console.error("Erro ao criar post:", err);
      alert("Erro ao criar post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Criar Novo Post</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <Textarea
          placeholder="Conteúdo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
        <Textarea
          placeholder="Resumo"
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
        />
        <Input
          type="text"
          placeholder="URL da Imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Tags (separadas por vírgula)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Post"}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePost;
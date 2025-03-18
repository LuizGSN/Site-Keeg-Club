import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { theme } from "../../GlobalStyles";
import { RichTextEditor } from '../../components/RichTextEditor';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${theme.colors.background};
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
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid ${theme.colors.tertiary};
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid ${theme.colors.tertiary};
  border-radius: 4px;
  height: 150px;
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  padding: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background-color: ${theme.colors.tertiary};
  }
`;

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    titulo: "",
    conteudo: "",
    categoria: "",
    resumo: "",
    imagem: "",
    tags: [],
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${id}`);
        setPost({
          ...response.data,
          tags: response.data.tags || [],
        });
      } catch (error) {
        console.error("Erro ao buscar o post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/posts/${id}`,
        {
          ...post,
          tags: post.tags,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/admin");
    } catch (error) {
      console.error("Erro ao atualizar o post:", error);
    }
  };

  return (
    <Container>
      <Title>Editar Post</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="titulo"
          placeholder="Título"
          value={post.titulo}
          onChange={handleChange}
          required
        />
        <RichTextEditor
          initialValue={post.conteudo}
          onEditorChange={(newContent) => setPost({ ...post, conteudo: newContent })}
        />
        <Input
          type="text"
          name="categoria"
          placeholder="Categoria"
          value={post.categoria}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="resumo"
          placeholder="Resumo"
          value={post.resumo}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="imagem"
          placeholder="URL da Imagem"
          value={post.imagem}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="tags"
          placeholder="Tags (separadas por vírgula)"
          value={post.tags.join(", ")}
          onChange={(e) =>
            setPost({ ...post, tags: e.target.value.split(",").map(tag => tag.trim()) })
          }
          required
        />
        <Button type="submit">Salvar alterações</Button>
      </Form>
    </Container>
  );
};

export default EditPost;
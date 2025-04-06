import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../GlobalStyles";
import { RichTextEditor } from '../../components/RichTextEditor';
import { API_BASE_URL } from "../../config";

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
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

const BackButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

const CreatePost = () => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [resumo, setResumo] = useState("");
  const [imagem, setImagem] = useState(null);
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
  
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("conteudo", conteudo);
      formData.append("categoria", categoria);
      formData.append("resumo", resumo);
      formData.append("imagem", imagem);
  
      const tagsArray = tags.split(",").map(tag => tag.trim());
      formData.append("tags", JSON.stringify(tagsArray));
  
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Post criado:", response.data);
      navigate("/admin");
    } catch (err) {
      console.error("Erro ao criar post:", err);
      if (err.response) {
        console.error("Resposta do servidor:", err.response.data);
      }
      alert("Erro ao criar post");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAdmin = () => {
    navigate("/admin");
  };

return (
<Container>
<BackButton onClick={handleBackToAdmin}> Voltar </BackButton>
<Title>Criar Novo Post</Title>
<Form onSubmit={handleSubmit}>
  <Input
    type="text"
    placeholder="Título"
    value={titulo}
    onChange={(e) => setTitulo(e.target.value)}
  />
  <RichTextEditor
    initialValue={conteudo}
    onEditorChange={(newContent) => {
      setConteudo(newContent);
    }}
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
    type="file"
    accept="image/*"
    onChange={(e) => setImagem(e.target.files[0])}
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
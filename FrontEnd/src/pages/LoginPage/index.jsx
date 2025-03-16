import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { theme } from "../../GlobalStyles"; // Importando o tema global

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${theme.colors.background};
`;

const Form = styled.form`
  background: ${theme.colors.secondary};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid ${theme.colors.light};
  border-radius: 4px;
  background-color: ${theme.colors.tertiary};
  color: ${theme.colors.text};
  font-size: 1.6rem;

  &::placeholder {
    color: ${theme.colors.light};
  }

  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

const Button = styled.button`
  background: ${theme.colors.primary};
  color: ${theme.colors.text};
  border: none;
  padding: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.primary};
  font-size: 0.9rem;
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const res = await axios.post("http://localhost:3001/login", { email, senha });
      localStorage.setItem("token", res.data.token);
      navigate("/admin"); // Redireciona para o painel administrativo
    } catch (err) {
      setErro("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ color: theme.colors.text }}>Login</h2>
        {erro && <ErrorMessage>{erro}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <Button type="submit">Entrar</Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
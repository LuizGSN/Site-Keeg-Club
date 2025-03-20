import styled from 'styled-components';
import { theme } from '../../GlobalStyles';
import { FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useState } from 'react';

const Container = styled.div`
  max-width: ${theme.sizes.maxWidth};
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.xxlarge};
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
`;

const Text = styled.p`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.text};
  line-height: 1.8;
  text-align: center;
  margin-bottom: 2rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 3rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.text};

  svg {
    color: ${theme.colors.primary};
    font-size: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid ${theme.colors.tertiary};
  border-radius: 4px;
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.medium};
  color: black;
  background: ${theme.colors.light};
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 1px solid ${theme.colors.tertiary};
  border-radius: 4px;
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.medium};
  color: black;
  background: ${theme.colors.light};
  transition: border-color 0.3s;
  resize: vertical;
  min-height: 150px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

const Button = styled.button`
  background: ${theme.colors.primary};
  color: ${theme.colors.text};
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.medium};
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #FF4500;
    transform: translateY(-2px);
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;

  a {
    color: ${theme.colors.text};
    font-size: 2.4rem;
    transition: color 0.3s, transform 0.2s;

    &:hover {
      color: ${theme.colors.primary};
      transform: translateY(-3px);
    }
  }
`;

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const [success, setSuccess] = useState(false); // Estado para indicar sucesso no envio

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' }); // Limpa o formulário
      } else {
        alert('Erro ao enviar a mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar a mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Contato</Title>
      <Text>
        Olá, você é muito bem-vindo(a) ao Keeg Club! Se você tem dúvidas, sugestões ou apenas quer bater um papo sobre o universo geek, estamos aqui para você. Entre em contato conosco pelo formulário abaixo ou através das nossas redes sociais. Responderemos o mais breve possível!
      </Text>

      <ContactInfo>
        <InfoItem>
          <FaEnvelope />
          <span>keegclub60@gmail.com</span>
        </InfoItem>
      </ContactInfo>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Seu nome"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Seu e-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="subject"
          placeholder="Assunto"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <TextArea
          name="message"
          placeholder="Sua mensagem"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Mensagem'}
        </Button>
      </Form>

      {success && <p style={{ textAlign: 'center', color: theme.colors.primary }}>Mensagem enviada com sucesso!</p>}

      <SocialIcons>
        <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
        <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        <a href="#" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
      </SocialIcons>
    </Container>
  );
};
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../GlobalStyles';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: ${theme.colors.secondary};
  color: ${theme.colors.light};
  padding: 4rem 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: ${theme.sizes.maxWidth};
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
`;

const Section = styled.div`
  h3 {
    color: ${theme.colors.primary};
    margin-bottom: 1.5rem;
    font-family: ${theme.fonts.secondary};
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;

  a {
    color: ${theme.colors.light};
    font-size: 2.4rem;
    transition: color 0.3s;

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  input {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 4px;
  }

  button {
    background: ${theme.colors.primary};
    color: ${theme.colors.text};
    border: none;
    padding: 1rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #FF4500;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid ${theme.colors.tertiary};
`;

export const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/categories');
        if (!response.ok) {
          throw new Error('Erro ao buscar categorias');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Erro ao inscrever na newsletter');
      }

      alert('Inscrição realizada com sucesso!');
      setEmail('');
    } catch (error) {
      console.error(error);
      alert('Erro ao inscrever na newsletter');
    }
  };

  return (
    <FooterContainer>
      <FooterContent>
        {/* Seção 1: Logo e Slogan */}
        <Section>
          <h3>Keeg Club</h3>
          <p>Sua fonte de conteúdos nerds</p>
          <SocialIcons>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </SocialIcons>
        </Section>

        {/* Seção 2: Categorias */}
        <Section>
          <h3>Categorias</h3>
          <ul>
            {categories.map((category) => (
              <li key={category}>
                <Link to={`/category/${category}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </Section>

        {/* Seção 3: Newsletter */}
        <Section>
          <h3>Newsletter</h3>
          <p>Receba as novidades por email</p>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Inscrever</button>
          </NewsletterForm>
        </Section>
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} Keeg Club - Todos os direitos reservados
      </Copyright>
    </FooterContainer>
  );
};
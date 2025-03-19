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
  align-items: start;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const Section = styled.div`
  h3 {
    color: ${theme.colors.primary};
    margin-bottom: 1.5rem;
    font-family: ${theme.fonts.secondary};
    font-size: 1.8rem;
    font-weight: 600;
  }

  p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
    color: ${theme.colors.textLight};
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 1rem;

      a {
        color: ${theme.colors.light};
        text-decoration: none;
        transition: color 0.3s, transform 0.2s;

        &:hover {
          color: ${theme.colors.primary};
          transform: translateX(5px);
        }
      }
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;

  a {
    color: ${theme.colors.light};
    font-size: 2.4rem;
    transition: color 0.3s, transform 0.2s;

    &:hover {
      color: ${theme.colors.primary};
      transform: translateY(-3px);
    }
  }

  @media (max-width: ${theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  input {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 4px;
    font-size: 1.4rem;
    background: ${theme.colors.dark};
    color: ${theme.colors.text};
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
    }

    &::placeholder {
      color: ${theme.colors.textLight};
    }
  }

  button {
    background: ${theme.colors.primary};
    color: ${theme.colors.text};
    border: none;
    padding: 1rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
    font-size: 1.4rem;

    &:hover {
      background: #FF4500;
      transform: translateY(-2px);
    }
  }

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid ${theme.colors.tertiary};
  font-size: 1.4rem;
  color: ${theme.colors.textLight};
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

        <Section>
          <h3>Links Úteis</h3>
          <ul>
            <li><Link to="/politica-de-privacidade">Política de Privacidade</Link></li>
            <li><Link to="/termos-de-uso">Termos de Uso</Link></li>
            <li><Link to="/sobre">Sobre Nós</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </Section>

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
import styled from 'styled-components';
import { theme } from '../../GlobalStyles';
import { Link } from 'react-router-dom';
import { SearchBar } from '../Search';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: ${theme.sizes.navbarHeight};
  background: ${theme.colors.secondary};
  display: flex;
  align-items: center;
  z-index: 1000;
  padding: 0 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); // Sombra sutil
`;

const NavContent = styled.div`
  max-width: ${theme.sizes.maxWidth};
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-family: ${theme.fonts.secondary};
  font-size: 2.4rem;
  color: ${theme.colors.primary};
  font-weight: 600; // Peso da fonte ajustado
  text-decoration: none;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8; // Efeito de opacidade ao passar o mouse
  }

  img {
    height: 80px; // Ajuste o tamanho da logo conforme necessário
  }
`;

const Menu = styled.div`
  display: flex;
  flex-grow: 1; // Ocupa o espaço disponível entre a logo e a barra de pesquisa
  justify-content: center; // Centraliza os itens do menu
  gap: 2rem; // Reduzi o espaçamento entre os links

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const MenuLink = styled(Link)`
  color: ${theme.colors.text};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.medium};
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s, transform 0.2s;

  &:hover {
    color: ${theme.colors.primary};
    transform: translateY(-2px); // Efeito de levantar ao passar o mouse
  }
`;

export const Navbar = () => {
  const categories = ['Animes', 'Filmes', 'Séries', 'Jogos'];

  return (
    <Nav>
      <NavContent>
        <Logo to="/">
          <img src="/src/images/Keeg-Club-Png.png" alt="Keeg Club Logo" />
        </Logo>
        <Menu>
          {categories.map((category) => (
            <MenuLink key={category} to={`/category/${category}`}>
              {category}
            </MenuLink>
          ))}
        </Menu>
        <SearchBar />
      </NavContent>
    </Nav>
  );
};
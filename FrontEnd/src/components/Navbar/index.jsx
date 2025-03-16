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
  font-weight: 700;
`;

const Menu = styled.div`
  display: flex;
  gap: 3rem;

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const MenuLink = styled(Link)`
  color: ${theme.colors.text};
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

export const Navbar = () => {
  // Defina as categorias exatamente como estão no banco de dados
  const categories = ['Animes', 'Filmes', 'Séries', 'Jogos'];

  return (
    <Nav>
      <NavContent>
        <Logo to="/">Keeg Club</Logo>
        <Menu>
          {categories.map((category) => (
            <MenuLink key={category} to={`/category/${category}`}> {/* Removido toLowerCase() */}
              {category}
            </MenuLink>
          ))}
        </Menu>
        <SearchBar />
      </NavContent>
    </Nav>
  );
};
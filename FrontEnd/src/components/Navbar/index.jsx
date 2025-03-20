import styled from 'styled-components';
import { theme } from '../../GlobalStyles';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from '../Search';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.3s;

  img {
    height: 70px;
  }
`;

const Menu = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  gap: 2rem;

  @media (max-width: ${theme.breakpoints.md}) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: fixed;
    top: ${theme.sizes.navbarHeight};
    left: 0;
    width: 100%;
    height: calc(100vh - ${theme.sizes.navbarHeight});
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    align-items: center;
    justify-content: flex-start;
    padding: 2rem 0;
    transition: transform 0.3s ease-in-out;
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
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
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 1rem 0;
    font-size: 1.2rem;
    color: ${theme.colors.light};
    transition: color 0.3s;

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; // Espaçamento entre os ícones
`;

const HamburgerIcon = styled.div`
  display: none;
  font-size: 1.5rem;
  color: ${theme.colors.text};
  cursor: pointer;
  z-index: 1001;

  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

export const Navbar = () => {
  const categories = ['Animes', 'Filmes', 'Séries', 'Jogos'];
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (to) => {
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Nav>
      <NavContent>
        <Logo to="/" onClick={() => handleLinkClick('/')}>
          <img src="/src/images/Keeg-Club-Logo-Png.png" alt="Keeg Club Logo" />
        </Logo>
        <Menu isOpen={isMenuOpen}>
          {categories.map((category) => (
            <MenuLink
              key={category}
              to={`/category/${category}`}
              onClick={() => handleLinkClick(`/category/${category}`)}
            >
              {category}
            </MenuLink>
          ))}
        </Menu>
        <IconsContainer>
          <SearchBar />
          <HamburgerIcon onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </HamburgerIcon>
        </IconsContainer>
      </NavContent>
    </Nav>
  );
};
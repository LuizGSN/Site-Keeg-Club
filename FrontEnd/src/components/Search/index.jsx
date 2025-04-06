import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../GlobalStyles';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchContainer = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  border: 2px solid ${theme.colors.primary};
  background: ${theme.colors.dark};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.small};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }

  &::placeholder {
    color: ${theme.colors.textLight};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: absolute;
    top: 100%;
    right: 0;
    width: 200px;
    margin-top: 0.5rem;
  }
`;

const SearchIcon = styled.div`
  font-size: 1.5rem;
  color: ${theme.colors.text};
  cursor: pointer;
  display: none;

  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSearch}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar posts..."
          isOpen={isSearchOpen}
        />
      </form>
      <SearchIcon onClick={toggleSearch}>
        {isSearchOpen ? <FaTimes /> : <FaSearch />}
      </SearchIcon>
    </SearchContainer>
  );
};
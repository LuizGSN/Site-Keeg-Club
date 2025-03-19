import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../GlobalStyles';

const SearchContainer = styled.div`
  position: relative;
  max-width: 300px; // Reduzi a largura máxima
  margin-left: auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1.5rem; // Ajustei o padding para um tamanho menor
  border-radius: 20px;
  border: 2px solid ${theme.colors.primary};
  background: ${theme.colors.dark};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.small}; // Usei um tamanho de fonte menor
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent}; // Adicionei uma cor de destaque ao focar
  }

  &::placeholder {
    color: ${theme.colors.textLight}; // Cor mais clara para o placeholder
  }
`;

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSearch}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar posts..."
        />
      </form>
    </SearchContainer>
  );
};
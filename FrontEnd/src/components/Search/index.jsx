import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../GlobalStyles';

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
  margin-left: auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 20px;
  border: 2px solid ${theme.colors.primary};
  background: ${theme.colors.dark};
  color: ${theme.colors.text};
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
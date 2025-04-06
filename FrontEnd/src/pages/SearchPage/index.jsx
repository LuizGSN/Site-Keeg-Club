import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { PostCard } from '../HomePage/PostCard';
import { theme } from '../../GlobalStyles';
import { API_BASE_URL } from '../../config';

const Container = styled.div`
  max-width: ${theme.sizes.maxWidth};
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 3rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q')?.toLowerCase();

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/posts?q=${query}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar posts');
        }
        const data = await response.json();
        setFilteredPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [query]);

  if (!query) {
    return (
      <Container>
        <h1>Digite algo para pesquisar</h1>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <h1>Carregando...</h1>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h1>Erro: {error}</h1>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Resultados para: {query}</h1>
      {filteredPosts.length > 0 ? (
        <Grid>
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </Grid>
      ) : (
        <p>Nenhum post encontrado para "{query}"</p>
      )}
    </Container>
  );
};
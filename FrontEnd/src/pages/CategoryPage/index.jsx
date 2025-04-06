import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { PostCard } from '../HomePage/PostCard';
import { theme } from '../../GlobalStyles';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const Container = styled.div`
  max-width: ${theme.sizes.maxWidth};
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.xxlarge};
  color: ${theme.colors.primary};
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 3rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const CategoryPage = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/posts?categoria=${category}`);
              
        if (response.data && Array.isArray(response.data.posts)) {
          setPosts(response.data.posts);
        } else {
          console.error('Posts não encontrados na resposta da API');
          setPosts([]);
        }
      } catch (err) {
        console.error("Erro ao carregar posts por categoria", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [category]);

  if (loading) {
    return <Container>Carregando posts...</Container>;
  }
  if (!posts.length) {
    return <Container>Não há posts para esta categoria.</Container>;
  }
  return (
    <Container>
      <Title>Posts sobre {category}</Title>
      <Grid>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              ...post,
              categoria: post.categoria,
              resumo: post.resumo,
              imagem: post.imagem,
              tags: post.tags || [],
            }}
          />
        ))}
      </Grid>
    </Container>
  );
};
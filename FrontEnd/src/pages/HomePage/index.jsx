import styled from 'styled-components';
import { PostCard } from './PostCard';
import { theme } from '../../GlobalStyles';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from '../../components/Pagination';

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

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (page) => {
    try {
      const res = await axios.get(`http://localhost:3001/posts?page=${page}&limit=6`);
      console.log("Resposta da API:", res.data);

      if (res.data && Array.isArray(res.data.posts)) {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      } else {
        console.error("Resposta da API inválida:", res.data);
        setPosts([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
      setPosts([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container>
      <h1>Últimas Postagens</h1>
      <Grid>
        {posts.length === 0 ? (
          <p>Nenhum post encontrado.</p>
        ) : (
          posts.map((post) => (
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
          ))
        )}
      </Grid>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};
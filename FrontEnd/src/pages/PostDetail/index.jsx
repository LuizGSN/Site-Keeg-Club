import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CommentForm } from '../../components/Comments';
import { theme } from '../../GlobalStyles';

const TagList = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
`;

const Tag = styled.span`
  background: ${theme.colors.secondary};
  color: ${theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1.4rem;
`;

const Container = styled.div`
  max-width: ${theme.sizes.maxWidth};
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const PostTitle = styled.h1`
  color: ${theme.colors.text};
  margin-bottom: 2rem;
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 3rem;
`;

const PostContent = styled.article`
  background: ${theme.colors.tertiary};
  padding: 3rem;
  border-radius: 8px;
  margin-bottom: 4rem;

  p {
    margin-bottom: 2rem;
    line-height: 1.8;
  }
`;

const MetaData = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  color: ${theme.colors.primary};
`;

export const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const postData = await response.json();
        console.log("Dados recebidos do backend:", postData);

        const normalizedData = {
          ...postData,
          tags: postData.tags ? postData.tags : [],
        };

        setPost(normalizedData);
      } catch (error) {
        console.error("Erro ao buscar dados do post:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  // Atualiza o título da página com o título do post
  useEffect(() => {
    if (post && post.titulo) {
      document.title = post.titulo; // Define o título da página como o título do post
    }
  }, [post]);

  if (error) {
    return <Container>Erro: {error}</Container>;
  }

  if (loading) {
    return <Container>Carregando...</Container>;
  }

  if (!post) {
    return <Container>Post não encontrado</Container>;
  }

  return (
    <Container>
      <PostTitle>{post.titulo}</PostTitle>
      <PostImage src={post.imagem} alt={post.titulo} />
      <MetaData>
        <span>Categoria: {post.categoria}</span>
        <span>
          Publicado em: {post.data ? new Date(post.data).toLocaleDateString('pt-BR') : 'Data não disponível'}
        </span>
      </MetaData>
      <PostContent dangerouslySetInnerHTML={{ __html: post.conteudo }} />
      
      <section>
        <h2>Tags</h2>
        {post.tags && post.tags.length > 0 ? (
          <TagList>
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagList>
        ) : (
          <p>Sem tags para este post</p>
        )}
      </section>

      <CommentForm postId={id} />
    </Container>
  );
};
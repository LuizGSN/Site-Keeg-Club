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

const PostHeader = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const PostTitle = styled.h1`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.xxlarge};
  color: ${theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const PostImage = styled.img`
  width: 100%;
  max-width: 700px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  margin: 0 auto 3rem;
  display: block;
`;

const PostContent = styled.article`
  background: ${theme.colors.tertiary};
  max-width: 700px;
  margin: 0 auto;
  padding: 5rem 2rem;
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
  justify-content: center;
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

  useEffect(() => {
    if (post && post.titulo) {
      document.title = post.titulo;
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

  // Construa o URL completo da imagem
  const imagemUrl = `http://localhost:3001${post.imagem}`;

  return (
    <Container>
      <PostHeader>
        <PostTitle>{post.titulo}</PostTitle>
        <PostImage src={imagemUrl} alt={post.titulo} />
      </PostHeader>
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
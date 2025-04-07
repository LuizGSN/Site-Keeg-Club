import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../../GlobalStyles';
import { API_BASE_URL } from '../../config';

const Card = styled.article`
  background: ${theme.colors.tertiary};
  border: 0.5px solid #ca5b112d;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 100%;
  max-width: 350px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px #ff660065;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 2rem;
`;

const Category = styled.span`
  display: inline-block;
  background: ${theme.colors.primary};
  color: ${theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.xlarge};
  color: ${theme.colors.text};
  margin-bottom: 1rem;
`;

const PostDate = styled.small`
  color: ${theme.colors.primary};
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const Tag = styled.span`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
`;

export const PostCard = ({ post }) => {
  console.log("Caminho da imagem:", post.imagem);

  const imagemUrl = `${API_BASE_URL}${post.imagem}`;

  return (
    <Card>
      <Link to={`/post/${post.id}`}>
        <ImageContainer>
          <Image src={imagemUrl} alt={post.titulo} />
        </ImageContainer>
        <Content>
          <Category>{post.categoria}</Category>
          <Title>{post.titulo}</Title>
          {post.tags && post.tags.length > 0 && (
            <TagsContainer>
              {post.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer>
          )}
          <PostDate>
            {post.data ? new Date(post.data).toLocaleDateString() : 'Data não disponível'}
          </PostDate>
        </Content>
      </Link>
    </Card>
  );
};
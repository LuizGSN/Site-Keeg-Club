import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../GlobalStyles';

const TagList = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const Tag = styled(Link)`
  background: ${theme.colors.primary};
  color: ${theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1.2rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

// Use assim:
<TagList>
  {post.tags.map((tag) => (
    <Tag key={tag} to={`/tag/${tag}`}>{tag}</Tag>
  ))}
</TagList>
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { theme } from '../../GlobalStyles';

const CommentSection = styled.section`
  margin-top: 4rem;
  padding: 2rem;
  background: ${theme.colors.tertiary};
  border-radius: 8px;
`;

const CommentFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 600px;

  input,
  textarea {
    padding: 0.8rem;
    border: 1px solid ${theme.colors.secondary};
    border-radius: 12px;
    background: ${theme.colors.dark};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fontSizes.base};

    &::placeholder {
      color: ${theme.colors.text};
      opacity: 0.7;
    }
  }

  textarea {
    height: 100px;
    resize: vertical;
  }

  button {
    padding: 0.8rem;
    background: ${theme.colors.primary};
    color: ${theme.colors.text};
    border: none;
    border-radius: 12px;
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fontSizes.base};
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background: ${theme.colors.secondary};
    }
  }

  .error {
    color: #ff4d4d;
    font-size: ${theme.fontSizes.small};
    margin-top: 0.5rem;
  }
`;

const CommentListStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 600px;
`;

const CommentItem = styled.div`
  padding: 1.5rem;
  background: ${theme.colors.dark};
  border-radius: 6px;
  border: 1px solid ${theme.colors.secondary};

  strong {
    font-family: ${theme.fonts.secondary};
    font-size: ${theme.fontSizes.medium};
    color: ${theme.colors.primary};
  }

  p {
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fontSizes.base};
    color: ${theme.colors.text};
    margin: 1rem 0;
  }

  small {
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fontSizes.small};
    color: ${theme.colors.text};
    opacity: 0.8;
  }
`;

export const CommentForm = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${postId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error('Erro ao carregar comentários');
        }
      } catch (error) {
        console.error('Erro de rede:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment) {
      setError('O comentário não pode estar vazio.');
      return;
    }

    setError('');

    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          text: comment,
          author_name: authorName,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setComment('');
        setAuthorName('');
      } else {
        console.error('Erro ao enviar comentário');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  return (
    <CommentSection>
      <h3>Deixe seu comentário</h3>
      <CommentFormStyled onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Seu nome (opcional)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escreva seu comentário..."
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Enviar Comentário</button>
      </CommentFormStyled>

      <CommentListStyled>
        {comments.length === 0 ? (
          <p>Seja o primeiro a comentar!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id}>
              <strong>{comment.author_name || 'Anônimo'}</strong>
              <p>{comment.text}</p>
              <small>{new Date(comment.date).toLocaleString('pt-BR')}</small>
            </CommentItem>
          ))
        )}
      </CommentListStyled>
    </CommentSection>
  );
};
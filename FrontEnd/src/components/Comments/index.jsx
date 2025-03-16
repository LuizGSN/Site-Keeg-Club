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
  margin-bottom: 3rem;

  textarea {
    height: 150px;
    resize: vertical;
  }

  input {
    height: 40px;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  .error {
    color: red;
    font-size: 0.9rem;
  }
`;

const CommentListStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CommentItem = styled.div`
  padding: 1.5rem;
  background: ${theme.colors.dark};
  border-radius: 6px;
`;

export const CommentForm = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]); // Estado para armazenar os comentários

  // Buscar comentários ao carregar o componente ou quando o postId mudar
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${postId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);  // Armazenar os comentários no estado
        } else {
          console.error('Erro ao carregar comentários');
        }
      } catch (error) {
        console.error('Erro de rede:', error);
      }
    };

    fetchComments();
  }, [postId]); // Reexecuta sempre que o postId mudar

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
        setComments([newComment, ...comments]);  // Adicionar o novo comentário ao início da lista
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

      {/* Exibir comentários */}
      <CommentListStyled>
        {comments.length === 0 ? (
          <p>Seja o primeiro a comentar!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id}>
              <strong>{comment.author_name}</strong>
              <p>{comment.text}</p>
              <small>{new Date(comment.date).toLocaleString()}</small>
            </CommentItem>
          ))
        )}
      </CommentListStyled>
    </CommentSection>
  );
};
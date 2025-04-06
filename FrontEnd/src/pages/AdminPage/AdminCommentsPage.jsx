import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { theme } from "../../GlobalStyles";
import { FaTrash, FaSearch } from "react-icons/fa";
import { API_BASE_URL } from "../../config";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${theme.colors.background};
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${theme.colors.text};
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.xxlarge};
  margin-bottom: 2rem;
`;

const CommentList = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: ${theme.colors.secondary};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const CommentItem = styled.div`
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: ${theme.colors.tertiary};
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 120px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.strong`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.secondary};
`;

const CommentDate = styled.small`
  color: ${theme.colors.text};
  opacity: 0.7;
  font-family: ${theme.fonts.primary};
`;

const CommentContent = styled.p`
  color: ${theme.colors.text};
  font-family: ${theme.fonts.primary};
  margin: 0.5rem 0;
`;

const PostReference = styled.div`
  margin-top: 0.5rem;
  font-style: italic;
  color: ${theme.colors.text};
  opacity: 0.8;
  font-size: ${theme.fontSizes.small};
  cursor: help;
  border-bottom: 1px dashed ${theme.colors.text};
  display: inline-block;
  position: relative;

  &:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.colors.dark};
    color: ${theme.colors.text};
    padding: 0.5rem;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 100;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`;

const IconButton = styled(({ delete: isDelete, ...props }) => <button {...props} />)`
  background: none;
  border: none;
  color: ${(props) => (props.delete ? theme.colors.primary : theme.colors.primary)};
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 8rem;
  right: 0rem;

  &:hover {
    color: ${(props) => (props.delete ? "#C82333" : theme.colors.secondary)};
  }

  & + & {
    margin-left: 10px;
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 1rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 1rem;
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: 4px;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${theme.colors.secondary};
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.colors.secondary};
  }

  &:disabled {
    background-color: ${theme.colors.tertiary};
    cursor: not-allowed;
  }
`;

const PageNumber = styled.span`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text};
  font-family: ${theme.fonts.primary};
`;

const LogoutButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;
const BackButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

const AdminCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [postsMap, setPostsMap] = useState({});
  const navigate = useNavigate();

  const loadComments = async (page = 1, searchTerm = "") => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/comments?page=${page}&limit=10&q=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && Array.isArray(response.data.comments)) {
        setComments(response.data.comments);
        setTotalPages(response.data.totalPages);
        
        const postIds = [...new Set(response.data.comments.map(c => c.post_id))];
        const postsResponse = await axios.get(`${API_BASE_URL}/posts?ids=${postIds.join(',')}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const posts = {};
        postsResponse.data.posts.forEach(post => {
          posts[post.id] = post.titulo;
        });
        setPostsMap(posts);
      } else {
        throw new Error("Resposta da API inválida");
      }
    } catch (err) {
      console.error("Erro ao carregar comentários:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAdmin = () => {
    navigate("/admin");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Tem certeza que deseja excluir este comentário?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      loadComments(currentPage, searchTerm);
    } catch (err) {
      console.error("Erro ao excluir comentário:", err);
      alert("Erro ao excluir comentário. Tente novamente.");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      loadComments(currentPage + 1, searchTerm);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      loadComments(currentPage - 1, searchTerm);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
    loadComments(1, searchTerm);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
    loadComments(totalPages, searchTerm);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    console.log('postsMap atualizado:', postsMap);
    loadComments(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  return (
    <Container>
      <BackButton onClick={handleBackToAdmin}>Voltar</BackButton>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      <Title>Gerenciar Comentários</Title>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Buscar por autor ou conteúdo..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <SearchIcon />
      </SearchContainer>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <CommentList>
            {comments.length === 0 ? (
              <p>Nenhum comentário encontrado.</p>
            ) : (
              comments.map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentHeader>
                    <CommentAuthor>
                      {comment.author_name || "Anônimo"}
                    </CommentAuthor>
                    <CommentDate>
                      {new Date(comment.date).toLocaleString('pt-BR')}
                    </CommentDate>
                  </CommentHeader>
                  <CommentContent>{comment.text}</CommentContent>
                  <PostReference title={postsMap[comment.post_id] || `Post ID: ${comment.post_id}`}>
                    Post ID: {comment.post_id}
                 </PostReference>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <IconButton 
                      delete 
                      onClick={() => handleDeleteComment(comment.id)}
                      title="Excluir comentário"
                    >
                      <FaTrash />
                    </IconButton>
                  </div>
                </CommentItem>
              ))
            )}
          </CommentList>

          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton onClick={handleFirstPage} disabled={currentPage === 1}>
                Primeira
              </PaginationButton>
              <PaginationButton onClick={handlePreviousPage} disabled={currentPage === 1}>
                Anterior
              </PaginationButton>
              <PageNumber>
                Página {currentPage} de {totalPages}
              </PageNumber>
              <PaginationButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                Próximo
              </PaginationButton>
              <PaginationButton onClick={handleLastPage} disabled={currentPage === totalPages}>
                Última
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}
    </Container>
  );
};

export default AdminCommentsPage;
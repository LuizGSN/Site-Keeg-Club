import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { theme } from "../../GlobalStyles";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${theme.colors.background};
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${theme.colors.text};
  margin-bottom: 2rem;
`;

const PostList = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: ${theme.colors.secondary};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const PostItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: ${theme.colors.tertiary};
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  & > div {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  & > button {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.text};
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.secondary};
    }
  }
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  margin-bottom: 2rem;

  &:hover {
    background-color: ${theme.colors.secondary};
  }
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
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.secondary};
  }

  &:disabled {
    background-color: ${theme.colors.tertiary};
    cursor: not-allowed;
  }
`;

const PageNumber = styled.span`
  font-size: 1rem;
  color: ${theme.colors.text};
`;

const LogoutButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

const AdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const loadPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/posts?page=${page}&limit=6`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && Array.isArray(response.data.posts)) {
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      } else {
        throw new Error("Resposta da API inválida");
      }
    } catch (err) {
      console.error("Erro ao carregar posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate("/admin/create");
  };

  const handleEditPost = (postId) => {
    navigate(`/admin/edit/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Tem certeza que deseja excluir este post?")) return;

    try {
      await axios.delete(`http://localhost:3001/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      loadPosts(currentPage);
    } catch (err) {
      console.error("Erro ao excluir post:", err);
      alert("Erro ao excluir post. Tente novamente.");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      loadPosts(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      loadPosts(currentPage - 1);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  return (
    <Container>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      <Title>Keeg Club</Title>
      <Button onClick={handleCreatePost}>NOVA POSTAGEM</Button>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <PostList>
            {posts.map((post) => (
              <PostItem key={post.id}>
                <div>
                  <span>{post.titulo}</span>
                  {post.tags && post.tags.length > 0 && (
                    <TagsContainer>
                      {post.tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </TagsContainer>
                  )}
                </div>
                <div>
                  <button onClick={() => handleEditPost(post.id)}>Editar</button>
                  <button onClick={() => handleDeletePost(post.id)} style={{ marginLeft: "10px" }}>Excluir</button>
                </div>
              </PostItem>
            ))}
          </PostList>

          <PaginationContainer>
            <PaginationButton onClick={handlePreviousPage} disabled={currentPage === 1}>
              Anterior
            </PaginationButton>
            <PageNumber>
              Página {currentPage} de {totalPages}
            </PageNumber>
            <PaginationButton onClick={handleNextPage} disabled={currentPage === totalPages}>
              Próximo
            </PaginationButton>
          </PaginationContainer>
        </>
      )}
    </Container>
  );
};

export default AdminPage;
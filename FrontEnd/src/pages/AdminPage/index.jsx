import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { theme } from "../../GlobalStyles";
import { FaEdit, FaTrash } from "react-icons/fa";

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
    font-size: ${theme.fontSizes.base};
    font-family: ${theme.fonts.primary};
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
  font-size: ${theme.fontSizes.small};
  font-family: ${theme.fonts.primary};
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  margin-bottom: 2rem;
  transition: background-color 0.3s ease;

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

const IconButton = styled(({ delete: isDelete, ...props }) => <button {...props} />)`
  background: none;
  border: none;
  color: ${(props) => (props.delete ? theme.colors.primary : theme.colors.primary)};
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  display: flex;
  align-items: center;
  justify-content: center;

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
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
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

const AdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadPosts = async (page = 1, searchTerm = "") => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/posts?page=${page}&limit=6&q=${searchTerm}`, {
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Resetar para a primeira página ao buscar
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
    loadPosts(1);
  };
  
  const handleLastPage = () => {
    setCurrentPage(totalPages);
    loadPosts(totalPages);
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
    loadPosts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);;

  return (
    <Container>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      <Title>
        <img width={225} src="/src/images/Keeg-Club-Logo-Png.png" alt="Keeg Club logo" />
      </Title>
      <Button onClick={handleCreatePost}>NOVA POSTAGEM</Button>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </SearchContainer>

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
                  <IconButton onClick={() => handleEditPost(post.id)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton delete onClick={() => handleDeletePost(post.id)}>
                    <FaTrash />
                  </IconButton>
                </div>
              </PostItem>
            ))}
          </PostList>

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
        </>
      )}
    </Container>
  );
};

export default AdminPage;
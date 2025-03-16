import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './GlobalStyles';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { PostDetail } from './pages/PostDetail';
import { SearchPage } from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CreatePost from "./pages/AdminPage/CreatePost";
import EditPost from "./pages/AdminPage/EditPost";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Define o título da página com base na rota atual
    if (location.pathname === "/") {
      document.title = "Keeg Club";
    } else if (location.pathname === "/login") {
      document.title = "Keeg Club - Admin";
    } else if (location.pathname.startsWith("/admin")) {
      document.title = "Keeg Club - Admin";
    } else {
      document.title = "Keeg Club";
    }
  }, [location.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 160px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/create" element={<CreatePost />} />
          <Route path="/admin/edit/:id" element={<EditPost />} />
        </Routes>
      </main>
      <Footer />
    </ThemeProvider>
  );
}

// Wrapper para usar useLocation no componente App
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
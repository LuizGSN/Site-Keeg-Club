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
import ProtectedRoute from './components/ProtectedRoute';
import { PrivacyPolicy } from './pages/FooterPage/PrivacyPolicy';
import { TermsOfUse } from './pages/FooterPage/TermsOfUse';
import { About } from './pages/FooterPage/About';
import { Contact } from './pages/FooterPage/Contact';
import AdminCommentsPage from './pages/AdminPage/AdminCommentsPage'

function App() {
  const location = useLocation();

  useEffect(() => {
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

  const hideNavbarAndFooter = location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {!hideNavbarAndFooter && <Navbar />}
      <main style={{ minHeight: 'calc(100vh - 160px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute> <AdminPage /> </ProtectedRoute>}/>
          <Route path="/admin/create" element={<ProtectedRoute> <CreatePost /> </ProtectedRoute>} />
          <Route path="/admin/edit/:id" element={<ProtectedRoute> <EditPost /> </ProtectedRoute>} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
          <Route path="/termos-de-uso" element={<TermsOfUse />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/admin/comments" element={<AdminCommentsPage />} />
        </Routes>
      </main>
      {!hideNavbarAndFooter && <Footer />}
    </ThemeProvider>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
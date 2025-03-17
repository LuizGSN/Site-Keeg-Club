import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redireciona para a página de login se o token não existir
    }
  }, [token, navigate]);

  return token ? children : null; // Renderiza o conteúdo apenas se o token existir
};

export default ProtectedRoute;
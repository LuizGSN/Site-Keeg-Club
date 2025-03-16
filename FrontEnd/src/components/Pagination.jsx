import styled from 'styled-components';
import { theme } from '../GlobalStyles';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 3rem 0;
`;

const PageButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: ${props => 
    props.$active ? theme.colors.primary : theme.colors.secondary};
  color: ${theme.colors.text};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <PaginationContainer>
      {/* Botão "Anterior" */}
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </PageButton>
      
      {/* Botões de página */}
      {[...Array(totalPages)].map((_, index) => (
        <PageButton
          key={index}
          $active={currentPage === index + 1}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </PageButton>
      ))}
      
      {/* Botão "Próximo" */}
      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próximo
      </PageButton>
    </PaginationContainer>
  );
};
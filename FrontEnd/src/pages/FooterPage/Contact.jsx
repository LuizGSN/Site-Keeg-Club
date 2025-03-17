import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const Container = styled.div`
  max-width: ${theme.sizes.maxWidth};
  margin: 0 auto;
  padding: 4rem 2rem;
`;

export const Contact = () => {
  return (
    <Container>
      <h1>Contato</h1>
      <p>
      Olá, você é muito bem vindo(a) ao nosso site Keeg Club
Você pode entrar em contato comigo pelo e-mail keegclub60@gmail.com ou envie uma mensagem pelo formulário abaixo.

Entrarei em contato com você o mais breve possível.
      </p>
    </Container>
  );
};
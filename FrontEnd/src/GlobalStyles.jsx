import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#FF6500',
    secondary: '#1E3E62',
    tertiary: '#0B192C',
    dark: '#000000',
    light: '#F8F9FA',
    background: '#0B192C',
    text: '#FFFFFF'
  },
  fonts: {
    primary: "'Inter', sans-serif", // Fonte para textos longos
    secondary: "'Poppins', sans-serif", // Fonte para títulos
    special: "'Bangers', cursive" // Fonte para elementos especiais
  },
  fontSizes: {
    base: '1.6rem', // Corpo do texto
    small: '1.4rem', // Textos pequenos
    medium: '1.8rem', // Textos médios
    large: '2.0rem', // Títulos pequenos (reduzido)
    xlarge: '2.4rem', // Títulos médios (reduzido)
    xxlarge: '3.2rem', // Títulos grandes (reduzido)
    highlight: '4.0rem' // Destaques (reduzido)
  },
  sizes: {
    maxWidth: '1200px',
    navbarHeight: '80px'
  },
  breakpoints: {
    md: '768px',
    lg: '1024px'
  }
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  html {
    font-size: 62.5%; // 1rem = 10px
    scroll-behavior: smooth;
    scroll-padding-top: ${theme.sizes.navbarHeight};
  }

  body {
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fontSizes.base};
    line-height: 1.6;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    padding-top: ${theme.sizes.navbarHeight};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.secondary}; // Fonte para títulos
    margin-bottom: 1.5rem;
    line-height: 1.2;
    font-weight: 500; // Peso da fonte mais leve (não tão negrito)
    letter-spacing: -0.05rem; // Espaçamento entre letras mais apertado
  }

  h1 {
    font-size: ${theme.fontSizes.xxlarge};
    font-weight: 600; // Peso um pouco maior para o título principal
  }

  h2 {
    font-size: ${theme.fontSizes.xlarge};
  }

  h3 {
    font-size: ${theme.fontSizes.large};
  }

  h4 {
    font-size: ${theme.fontSizes.medium};
  }

  h5, h6 {
    font-size: ${theme.fontSizes.base};
  }

  p {
    font-size: ${theme.fontSizes.base};
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  a {
    color: inherit;
    text-decoration: none;
    font-size: ${theme.fontSizes.base};
  }

  small {
    font-size: ${theme.fontSizes.small};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  button, input, textarea, select {
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fontSizes.base};
  }

  .special-font {
    font-family: ${theme.fonts.special}; // Classe para elementos especiais
  }
`;
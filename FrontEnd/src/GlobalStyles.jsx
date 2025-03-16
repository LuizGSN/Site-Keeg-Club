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
    primary: "'Inter', sans-serif",
    secondary: "'Merriweather', serif"
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
    font-size: 62.5%;
    scroll-behavior: smooth;
    scroll-padding-top: ${theme.sizes.navbarHeight};
  }

  body {
    font-family: ${theme.fonts.primary};
    font-size: 1.6rem;
    line-height: 1.6;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    padding-top: ${theme.sizes.navbarHeight};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;
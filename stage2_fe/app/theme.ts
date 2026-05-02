"use client";

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A69279', // Donkey Brown mid
      light: '#C4B49A', // Donkey light
      dark: '#816E5C', // Donkey dark
    },
    secondary: {
      main: '#FFFFF0', // Ivory
    },
    background: {
      default: '#0F0D0B',
      paper: '#201B16',
    },
    text: {
      primary: '#FFFFF0',
      secondary: '#D9CCBA',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;

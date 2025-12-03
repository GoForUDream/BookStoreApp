import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#db637c', light: '#e98a9d', dark: '#c4506a' },
    secondary: { main: '#687890', light: '#8a9bb0', dark: '#4f5d70' },
    background: { default: '#fdf4f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: "'Playfair Display', serif" },
    h2: { fontFamily: "'Playfair Display', serif" },
    h3: { fontFamily: "'Playfair Display', serif" },
    h4: { fontFamily: "'Playfair Display', serif" },
    h5: { fontFamily: "'Playfair Display', serif" },
    h6: { fontFamily: "'Playfair Display', serif" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, padding: '8px 20px' },
        contained: {
          background: 'linear-gradient(135deg, #e98a9d 0%, #db637c 100%)',
          boxShadow: '0 4px 14px rgba(219, 99, 124, 0.3)',
          '&:hover': { background: 'linear-gradient(135deg, #db637c 0%, #c4506a 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderRadius: 16,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#fff',
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e2d9f3' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#db637c' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
});

import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
      marginBottom: "0.5rem",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      marginBottom: "0.5rem",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
      marginBottom: "0.5rem",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500,
      marginBottom: "0.5rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
})

export default theme

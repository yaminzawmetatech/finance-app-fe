import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#F07E2C",
      light: "#FFF0E5",
      dark: "#D96518",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#235DBB",
    },

    background: {
      default: "#F3F6FC",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#292E37",
      secondary: "#68758C",
    },

    divider: "#E3E9F4",
  },

  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",

    h1: {
      fontSize: "28px",
      fontWeight: 700,
      letterSpacing: "-0.8px",
    },

    h2: {
      fontSize: "24px",
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },

    h3: {
      fontSize: "20px",
      fontWeight: 650,
    },

    h4: {
      fontSize: "18px",
      fontWeight: 650,
    },

    h5: {
      fontSize: "16px",
      fontWeight: 650,
    },

    h6: {
      fontSize: "15px",
      fontWeight: 650,
    },

    body1: {
      fontSize: "14px",
      lineHeight: 1.6,
    },

    body2: {
      fontSize: "13px",
      lineHeight: 1.6,
    },

    button: {
      fontSize: "13px",
      fontWeight: 600,
      textTransform: "none",
    },

    caption: {
      fontSize: "11px",
    },
  },

  shape: {
    borderRadius: 9,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 38,
          boxShadow: "none",
        },

        containedPrimary: {
          "&:hover": {
            backgroundColor: "#D96518",
            boxShadow: "none",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #E3E9F4",
          boxShadow: "0 2px 8px rgba(24, 48, 91, 0.04)",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: "13px",

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B9CEF2",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F07E2C",
            borderWidth: "1px",
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "13px",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#E3E9F4",
          fontSize: "13px",
          padding: "12px 16px",
        },

        head: {
          backgroundColor: "#F3F6FC",
          color: "#405779",
          fontWeight: 650,
        },
      },
    },
  },
});

export default theme;
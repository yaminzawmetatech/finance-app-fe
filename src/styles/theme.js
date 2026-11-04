import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#F15A24",
      light: "#FFF0E5",
      dark: "#C94A1A",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#34383f",
    },

    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#292E37",
      secondary: "#72757b",
    },

    divider: "#eee9e5",
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
            backgroundColor: "#C94A1A",
            boxShadow: "none",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 0,
          boxShadow: "none",
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
            borderColor: "#f1a184",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F15A24",
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
          borderColor: "#eee9e5",
          fontSize: "13px",
          padding: "12px 16px",
        },

        head: {
          backgroundColor: "#fff7f2",
          color: "#45403d",
          fontWeight: 650,
        },
      },
    },
  },
});

export default theme;
import { createTheme, Theme } from "@mui/material/styles";

enum COLORS {
  background = "#093545",
  primary = "#2BD17E",
  error = "#EB5757",
  inputColor = "#224957",
  cardColor = "#092C39",
}

export type MyTheme = Theme;

export const lightTheme: Theme = createTheme({
  palette: {
    background: {
      default: COLORS.background,
      paper: COLORS.inputColor,
    },
    primary: {
      main: COLORS.primary,
    },
    error: {
      main: COLORS.error,
    },
    text: {
      primary: "#fff",
    },
  },
  components: {
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.inputColor,
          borderRadius: 10,
          color: "#fff",
        },
      },
      defaultProps: {
        size: "small",
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          color: "#fff",
          textTransform: "none",
          fontWeight: "bold",
        },
      },
      defaultProps: {
        variant: "contained",
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#092C39",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          padding: 10,
          borderRadius: 20,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          textAlign: "left",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
  },
} as MyTheme);

export interface IWithThemeProps {
  theme?: MyTheme;
}

export interface IWithClassName {
  className?: string;
}

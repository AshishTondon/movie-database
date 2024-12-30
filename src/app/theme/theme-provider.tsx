"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { lightTheme } from "./default";

const ThemeProviderComp = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default ThemeProviderComp;

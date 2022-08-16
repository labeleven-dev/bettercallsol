import { extendTheme, theme, ThemeConfig } from "@chakra-ui/react";

export default extendTheme({
  // use system colours, otherwise fallback to dark
  useSystemColorMode: true,
  initialColorMode: "dark",
  // set brand colour
  colors: {
    main: theme.colors.purple,
  },
  // dim the light mode background
  semanticTokens: {
    colors: {
      "chakra-body-bg": {
        _light: " #FBFBFB",
      },
    },
  },
  // reduce the font sizes a tinge
  fontSizes: {
    xs: "0.65rem",
    sm: "0.75rem",
    md: "0.875rem",
    lg: "1rem",
    xl: "1.125rem",
    "2xl": "1.25rem",
    "3xl": "1.5rem",
    "4xl": "1.875rem",
    "5xl": "2.25rem",
    "6xl": "3rem",
    "7xl": "3.75rem",
    "8xl": "4.5rem",
    "9xl": "6rem",
  },
} as ThemeConfig);

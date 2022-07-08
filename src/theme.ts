import { extendTheme, theme } from "@chakra-ui/react";

export default extendTheme({
  colors: {
    main: theme.colors.purple,
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
});

import { menuAnatomy, modalAnatomy } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  extendTheme,
  PartsStyleInterpolation,
  theme,
  ThemeConfig,
} from "@chakra-ui/react";

const multistyleTheme = <
  Part extends string,
  PartStyles extends PartsStyleInterpolation<{
    keys: Part[];
  }>
>(
  config: PartStyles,
  parts: Part[] | readonly Part[]
) => {
  const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts);

  const baseStyle = definePartsStyle(config);

  return defineMultiStyleConfig({ baseStyle });
};

export default extendTheme({
  // use system colours, otherwise fallback to dark
  useSystemColorMode: true,
  initialColorMode: "dark",
  colors: {
    main: theme.colors.purple,
  },
  semanticTokens: {
    colors: {
      "chakra-body-bg": {
        _dark: "#1A1A1D",
        _light: "#F7FAFC",
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
  components: {
    Icon: {
      color: "gray.500",
    },
    Menu: multistyleTheme(
      {
        list: {
          bg: "chakra-body-bg",
          mt: "-1",
        },
        item: {
          bg: "chakra-body-bg",
          _hover: {
            bg: "purple.500",
          },
          _focus: {
            bg: "purple.500",
          },
        },
      },
      menuAnatomy.keys
    ),
    Modal: multistyleTheme(
      {
        dialog: {
          bg: "chakra-body-bg",
        },
      },
      modalAnatomy.keys
    ),
    Popover: {
      baseStyle: {
        content: {
          bg: "chakra-body-bg",
        },
        arrow: {
          bg: "chakra-body-bg",
        },
      },
    },
  },
} as ThemeConfig);

import { Box, Text, VStack } from "@chakra-ui/react";

export const Acknowledgements: React.FC = () => (
  <VStack spacing="5">
    <Text>
      We'd like to acknowledge and thank the open-source libraries that have
      made this app possible.
    </Text>

    <Box
      p="3"
      as="kbd"
      fontSize="sm"
      maxH="400px"
      overflow="scroll"
      whiteSpace="nowrap"
      maxW="100%"
      boxShadow="inner"
    >
      <Text>
        @chakra-ui/icons (2.0.4), licenced MIT
        <br />
        @chakra-ui/react (2.2.4), licenced MIT
        <br />
        @dnd-kit/core (6.0.5), licenced MIT
        <br />
        @dnd-kit/modifiers (6.0.0), licenced MIT
        <br />
        @dnd-kit/sortable (7.0.1), licenced MIT
        <br />
        @emotion/react (11.9.3), licenced MIT
        <br />
        @emotion/styled (11.9.3), licenced MIT
        <br />
        @project-serum/anchor (0.25.0), licenced (MIT OR Apache-2.0)
        <br />
        @semantic-release/exec (6.0.3), licenced MIT
        <br />
        @sentry/react (7.10.0), licenced BSD-3-Clause
        <br />
        @solana/buffer-layout (4.0.0), licenced MIT
        <br />
        @solana/wallet-adapter-base (0.9.10), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-react (0.15.9), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-react-ui (0.9.12), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-wallets (0.17.2), licenced Apache-2.0
        <br />
        @solana/web3.js (1.51.0), licenced MIT
        <br />
        ajv (8.11.0), licenced MIT
        <br />
        axios (0.27.2), licenced MIT
        <br />
        bignumber.js (9.0.2), licenced MIT
        <br />
        crypto-browserify (3.12.0), licenced MIT
        <br />
        framer-motion (6.3.15), licenced MIT
        <br />
        immer (9.0.15), licenced MIT
        <br />
        js-sha256 (0.9.0), licenced MIT
        <br />
        pako (2.0.4), licenced (MIT AND Zlib)
        <br />
        react (18.2.0), licenced MIT
        <br />
        react-dom (18.2.0), licenced MIT
        <br />
        react-github-btn (1.3.0), licenced BSD-2-Clause
        <br />
        react-icons (3.11.0), licenced MIT
        <br />
        react-router-dom (6.3.0), licenced MIT
        <br />
        snake-case (3.0.4), licenced MIT
        <br />
        stream-browserify (3.0.0), licenced MIT
        <br />
        typescript (4.7.4), licenced Apache-2.0
        <br />
        uuid (8.3.2), licenced MIT
        <br />
        web-vitals (0.2.4), licenced Apache-2.0
        <br />
        zustand (4.0.0), licenced MIT
        <br />
        Phone icons created by Freepik - Flaticon
      </Text>
    </Box>

    <Text fontSize="sm">We ❤ Open Source Software</Text>
  </VStack>
);

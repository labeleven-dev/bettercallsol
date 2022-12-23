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
        @sentry/react (7.28.1), licenced MIT
        <br />
        @solana/buffer-layout (4.0.0), licenced MIT
        <br />
        @solana/wallet-adapter-backpack (0.1.7), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-base (0.9.17), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-brave (0.1.11), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-glow (0.1.12), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-ledger (0.9.19), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-phantom (0.9.16), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-react (0.15.19), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-react-ui (0.9.17), licenced Apache-2.0
        <br />
        @solana/wallet-adapter-solflare (0.6.16), licenced Apache-2.0
        <br />
        @solana/web3.js (1.63.1), licenced MIT
        <br />
        assert (2.0.0), licenced MIT
        <br />
        axios (0.27.2), licenced MIT
        <br />
        bignumber.js (9.0.2), licenced MIT
        <br />
        buffer (6.0.3), licenced MIT
        <br />
        chakra-ui-markdown-renderer (4.1.0), licenced MIT
        <br />
        crypto-browserify (3.12.0), licenced MIT
        <br />
        framer-motion (6.3.15), licenced MIT
        <br />
        immer (9.0.16), licenced MIT
        <br />
        js-sha256 (0.9.0), licenced MIT
        <br />
        jsbi (3.2.5), licenced Apache-2.0
        <br />
        pako (2.0.4), licenced (MIT AND Zlib)
        <br />
        process (0.11.10), licenced MIT
        <br />
        protobufjs (7.1.2), licenced BSD-3-Clause
        <br />
        react (18.2.0), licenced MIT
        <br />
        react-aria (3.18.0), licenced Apache-2.0
        <br />
        react-dom (18.2.0), licenced MIT
        <br />
        react-github-btn (1.3.0), licenced BSD-2-Clause
        <br />
        react-icons (3.11.0), licenced MIT
        <br />
        react-markdown (8.0.3), licenced MIT
        <br />
        react-router-dom (6.3.0), licenced MIT
        <br />
        react-stately (3.16.0), licenced Apache-2.0
        <br />
        snake-case (3.0.4), licenced MIT
        <br />
        stream-browserify (3.0.0), licenced MIT
        <br />
        typescript (4.9.4), licenced Apache-2.0
        <br />
        uuid (8.3.2), licenced MIT
        <br />
        web-vitals (0.2.4), licenced Apache-2.0
        <br />
        zustand (4.1.5), licenced MIT
        <br />
        Phone icons created by Freepik - Flaticon
      </Text>
    </Box>

    <Text fontSize="sm">We ❤ Open Source Software</Text>
  </VStack>
);

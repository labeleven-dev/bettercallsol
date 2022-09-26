import { Box } from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";

export const WalletButton: React.FC = () => (
  <Box
    mr="0.5"
    sx={{
      ".wallet-adapter-button": {
        height: "40px",
        fontSize: "13px",
        backgroundColor: "#1A202C",
      },
    }}
  >
    <WalletMultiButton />
  </Box>
);

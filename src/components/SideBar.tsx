import { Box, Icon, useColorModeValue } from "@chakra-ui/react";
import { ToggleIconButton } from "components/common/ToggleIconButton";
import { ImportPanel } from "components/import/ImportPanel";
import { useSessionStoreWithoutUndo } from "hooks/useSessionStore";
import { FaFileImport } from "react-icons/fa";

export const SideBar: React.FC = () => {
  const [sidePanel, setUI] = useSessionStoreWithoutUndo((state) => [
    state.uiState.sidePanel,
    state.set,
  ]);

  const bgColor = useColorModeValue(
    "rgba(0, 0, 0, 0.02)", // blackAlpha.25
    "rgba(255, 255, 255, 0.02)" // whiteAlpha.25
  );

  return (
    <>
      {sidePanel === "import" && (
        <Box flex="1" overflow="scroll" backgroundColor={bgColor} p="3">
          <ImportPanel />
        </Box>
      )}
      <ToggleIconButton
        label="Import"
        icon={<Icon as={FaFileImport} />}
        mr="1"
        rounded="none"
        roundedRight="md"
        backgroundColor={bgColor}
        toggled={sidePanel === "import"}
        onToggle={() => {
          setUI((state) => {
            state.uiState.sidePanel =
              sidePanel === "import" ? "closed" : "import";
          });
        }}
      />
    </>
  );
};

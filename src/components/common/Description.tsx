import { EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Button,
  Code,
  Collapse,
  Flex,
  Grid,
  GridProps,
  Heading,
  Icon,
  IconButton,
  Link,
  Spacer,
  Text,
  Textarea,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useSessionStoreWithoutUndo } from "hooks/useSessionStore";
import React, { ReactFragment, useState } from "react";
import { FaMarkdown } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export const Description: React.FC<
  {
    description?: string;
    setDescription: (description: string) => void;
  } & GridProps
> = ({ description, setDescription, ...gridProps }) => {
  const descriptionVisible = useSessionStoreWithoutUndo(
    (state) => state.uiState.descriptionVisible
  );
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [content, setContent] = useState("");

  const textColour = useColorModeValue("gray.500", "gray.400");
  const emptyTextColour = useColorModeValue("gray.300", "gray.600");
  const backgroundColor = useColorModeValue("blackAlpha.50", "whiteAlpha.100");

  return (
    <Collapse in={descriptionVisible}>
      <Grid
        p="3"
        pb="2"
        backgroundColor={backgroundColor}
        rounded="md"
        fontSize="md"
        {...gridProps}
      >
        <Collapse in={isEditOpen}>
          <Textarea
            fontFamily="mono"
            fontSize="sm"
            minH="300px"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />

          <Flex mt="2" mb="4">
            <Flex mt="-6" alignItems="center">
              <Icon mx="1" as={FaMarkdown} />
              <Text fontSize="sm">Markdown supported</Text>
            </Flex>
            <Spacer />
            <Button
              colorScheme="main"
              size="sm"
              mr="1"
              onClick={() => {
                setDescription(content);
                onEditClose();
              }}
            >
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={onEditClose}>
              Cancel
            </Button>
          </Flex>
        </Collapse>

        <Flex>
          <Markdown
            flex="1"
            textColor={description || isEditOpen ? textColour : emptyTextColour}
            content={
              isEditOpen
                ? content
                : description || "_Click edit to add a description_"
            }
          />
          {!isEditOpen && (
            <Tooltip label="Edit description">
              <IconButton
                ml="1"
                size="xs"
                variant="ghost"
                aria-label="Edit"
                icon={<EditIcon />}
                onClick={() => {
                  setContent(description || "");
                  onEditOpen();
                }}
              />
            </Tooltip>
          )}
        </Flex>
      </Grid>
    </Collapse>
  );
};

const Markdown: React.FC<{ content: string } & BoxProps> = ({
  content,
  ...boxProps
}) => {
  const { fontSize } = boxProps;
  const H4Heading = ({ children }: { children: ReactFragment }) => (
    <Heading my="4" as="h4" size={fontSize?.toString() || "md"}>
      {children}
    </Heading>
  );

  return (
    <Box {...boxProps}>
      <ReactMarkdown
        components={ChakraUIRenderer({
          // make all links external and add the icon
          a: ({ children, ...props }) => (
            <Link {...props} isExternal>
              {children} <ExternalLinkIcon mx="2px" />
            </Link>
          ),
          // reduce padding around code
          code: (props) => {
            const { inline, children, className } = props;

            if (inline) {
              return <Code p="1" children={children} />;
            }

            return (
              <Code
                className={className}
                whiteSpace="break-spaces"
                display="block"
                w="full"
                p="2"
                children={children}
              />
            );
          },
          // downsize larger headings to h4 so it doesn't look ugly
          h1: H4Heading,
          h2: H4Heading,
          h3: H4Heading,
        })}
        skipHtml
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

import {
  Box,
  Center,
  HStack,
  Icon,
  Image,
  Link,
  Text,
  useColorMode,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import GitHubButton from "react-github-btn";
import { FaGithub, FaTwitter, FaYoutube } from "react-icons/fa";

export const GITHUB_URL = "https://github.com/labeleven-dev/bettercallsol";

export const About: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <VStack mt="5">
      <Image w="80px" h="80px" src="/logo128.png" alt="Logo" />
      <Text
        p="2"
        fontFamily="'Dancing Script', cursive;"
        fontWeight="extrabold"
        fontSize="4xl"
        bgGradient="linear(to-r, #ff6f61ff, #fece2f)"
        bgClip="text"
      >
        Better Call Sol
      </Text>

      <Box h="5" />

      <Box p="5" boxShadow="dark-lg" rounded="lg">
        <Center mb="3">
          <Link href={GITHUB_URL} isExternal as="kbd" fontSize="md">
            <Icon as={FaGithub} mr="1" />
            labeleven-dev/bettercallsol
          </Link>
        </Center>

        <Wrap spacingX="1" spacingY="-1" justify="center" align="center">
          <WrapItem>
            <GitHubButton
              href="https://github.com/labeleven-dev/bettercallsol"
              data-icon="octicon-star"
              data-color-scheme={colorMode}
              data-show-count="true"
              aria-label="Star labeleven-dev/bettercallsol on GitHub"
            >
              Star
            </GitHubButton>
          </WrapItem>

          <WrapItem>
            <GitHubButton
              href="https://github.com/labeleven-dev/bettercallsol/subscription"
              data-icon="octicon-eye"
              data-color-scheme={colorMode}
              data-show-count="true"
              aria-label="Watch labeleven-dev/bettercallsol on GitHub"
            >
              Watch
            </GitHubButton>
          </WrapItem>

          <WrapItem>
            <GitHubButton
              href="https://github.com/labeleven-dev/bettercallsol/discussions"
              data-icon="octicon-comment-discussion"
              data-color-scheme={colorMode}
              aria-label="Discuss labeleven-dev/bettercallsol on GitHub"
            >
              Discuss
            </GitHubButton>
          </WrapItem>

          <WrapItem>
            <GitHubButton
              href="https://github.com/labeleven-dev/bettercallsol/issues/new?template=bug.yml&labels=bug"
              data-icon="octicon-issue-opened"
              data-color-scheme={colorMode}
              aria-label="Issue labeleven-dev/bettercallsol on GitHub"
            >
              Bug Report
            </GitHubButton>
          </WrapItem>

          <WrapItem>
            <GitHubButton
              href="https://github.com/labeleven-dev/bettercallsol/issues/new?template=feature_request.md&labels=enhancement"
              data-icon="octicon-issue-opened"
              data-color-scheme={colorMode}
              aria-label="Issue labeleven-dev/bettercallsol on GitHub"
            >
              Feature Request
            </GitHubButton>
          </WrapItem>

          <WrapItem>
            <GitHubButton
              href="https://github.com/labeleven-dev/bettercallsol/security/policy"
              data-icon="octicon-issue-opened"
              data-color-scheme={colorMode}
              aria-label="Issue labeleven-dev/bettercallsol on GitHub"
            >
              Security Policy
            </GitHubButton>
          </WrapItem>
        </Wrap>
      </Box>

      <Box h="5" />

      <Link href="https://labeleven.dev" isExternal>
        <Image w="100px" src="/labeleven.png" alt="Lab Eleven" />
      </Link>
      <HStack>
        <Link href="https://twitter.com/labeleven_dev" isExternal>
          <Icon mr="1" as={FaTwitter} />
        </Link>
        <Link href="https://github.com/labeleven-dev" isExternal>
          <Icon mr="1" as={FaGithub} />
        </Link>
        <Link
          href="https://www.youtube.com/channel/UCunAE5fS1UsgRTmLxjk9i4g"
          isExternal
        >
          <Icon as={FaYoutube} />
        </Link>
      </HStack>

      <Text fontSize="md" pt="5">
        Made with ❤ in 🇦🇺
      </Text>
    </VStack>
  );
};

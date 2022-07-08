import {
  Box,
  Center,
  Flex,
  Icon,
  Link,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer: React.FC = () => (
  <Box
    mt="20"
    p="5"
    pb="3"
    backgroundColor={useColorModeValue("blackAlpha.100", "blackAlpha.400")}
  >
    <Center>
      <Link mr="4" href="https://github.com/labeleven-dev" isExternal>
        <Icon as={FaGithub} />
      </Link>
      <Link mr="4" href="https://labeleven.dev" isExternal>
        <Icon as={FaGlobe} />
      </Link>
      <Link mr="4" href="https://twitter.com/labeleven_dev" isExternal>
        <Icon as={FaTwitter} />
      </Link>
      <Link href="https://linkedin.com/company/lab-eleven-dev/" isExternal>
        <Icon as={FaLinkedin} />
      </Link>
    </Center>
    <Flex>
      <Text fontSize="xs">© {new Date().getFullYear()} Lab Eleven</Text>
      <Spacer />
      <Text fontSize="xs">vXXXX</Text> {/* TODO get from package.json */}
    </Flex>
  </Box>
);

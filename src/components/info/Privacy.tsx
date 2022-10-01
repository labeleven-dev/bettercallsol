import { ExternalLinkIcon, StarIcon } from "@chakra-ui/icons";
import {
  Grid,
  Link,
  ListIcon,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { GITHUB_URL } from "./About";

export const Privacy: React.FC = () => (
  <Grid gridGap="3" bgGradient="linear(45deg,#9945ff,#19fb9d)" bgClip="text">
    <Text>Hello Anon-Kun,</Text>
    <Text>
      We value your privacy and have taken steps to preserve it while using{" "}
      <Text as="i">Better Call Sol</Text>:
    </Text>
    <UnorderedList spacing="2">
      <ListItem>
        <ListIcon as={StarIcon} color="main.600" />
        We are open-source. Both the code and the deployment pipelines are
        visible on our{" "}
        <Link href={GITHUB_URL} isExternal>
          GitHub repo
          <ExternalLinkIcon ml="1" color="main.600" />
        </Link>
        .
      </ListItem>
      <ListItem>
        <ListIcon as={StarIcon} color="main.600" />
        This app runs entirely in your browser and does not rely on a backend
        service, except of course, for the chain itself.
      </ListItem>
      <ListItem>
        <ListIcon as={StarIcon} color="main.600" />
        Your transaction executions are not captured or sent to another service.
      </ListItem>
      <ListItem>
        <ListIcon as={StarIcon} color="main.600" />
        Application monitoring is only used for error reporting so we can see
        the common errors and improve the tool. No transaction data is sent
        along with the errors.
      </ListItem>
    </UnorderedList>
  </Grid>
);

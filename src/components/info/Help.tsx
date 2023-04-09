import {
  Link as CharkaLink,
  Grid,
  LinkProps,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

const Link: React.FC<LinkProps> = ({ children, ...theRest }: LinkProps) => (
  <CharkaLink
    bgGradient="linear(45deg,#9945ff,#19fb9d)"
    bgClip="text"
    isExternal
    _hover={{ textShadow: "2px 2px 5px #9945FF" }}
    {...theRest}
  >
    {children}
  </CharkaLink>
);

export const Help: React.FC = () => (
  <Grid gridGap="3" my="5">
    <Text>Docs are coming soon!</Text>
    <Text>In the meanwhile, you can:</Text>
    <UnorderedList spacing="2">
      <ListItem>
        Load an example from Examples menu, to get a guided walkthrough of how
        to use this tool,
      </ListItem>
      <ListItem>
        Watch the{" "}
        <Link href="https://www.youtube.com/watch?v=z4TzkuKLWAA">
          Solana Transactions with Better Call Sol
        </Link>{" "}
        video to see the tool in action, or
      </ListItem>
      <ListItem>
        Ask questions on the{" "}
        <Link href="https://github.com/labeleven-dev/bettercallsol/discussions">
          Discusson Board
        </Link>
        .
      </ListItem>
    </UnorderedList>
    <Text></Text>
    <Text></Text>
  </Grid>
);

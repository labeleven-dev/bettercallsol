import {
  AddIcon,
  CloseIcon,
  DragHandleIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  FormLabel,
  Grid,
  Heading,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import produce, { Draft } from "immer";
import React, { useContext, useState } from "react";
import { FaRobot } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import { IPubKey } from "../../../models/internal-types";
import {
  addTo,
  Identifiable,
  removeFrom,
  SortableCollection,
  toSortableCollection,
  toSortedArray,
} from "../../../models/sortable";
import { Sortable, SortableItemContext } from "../../common/Sortable";

type Seed = { value: string } & Identifiable;
type SeedState = SortableCollection<Seed>;

const newSeedItem = () => ({
  id: uuid(),
  value: "",
});

export const PdaButton: React.FC<{
  programId: IPubKey;
  setPubkey: (pubkey: IPubKey) => void;
}> = ({ programId, setPubkey }) => {
  const [seeds, setSeedsOriginal] = useState<SeedState>(
    toSortableCollection([newSeedItem()])
  );
  const toast = useToast();

  const setSeeds = (fn: (state: Draft<SeedState>) => void) => {
    setSeedsOriginal(
      produce((draft) => {
        fn(draft);
      })
    );
  };

  const generate = () => {
    const [pubkey, bump] = PublicKey.findProgramAddressSync(
      seeds.order
        .map((i) => seeds.map[i].value)
        .filter((x) => x)
        .map((x) => Buffer.from(x)),
      new PublicKey(programId)
    );
    setPubkey(pubkey.toBase58());
    toast({
      title: "PDA found successfully!",
      description: `PDA was found with the following bump: ${bump}`,
      status: "success",
      isClosable: true,
      duration: null,
    });
  };

  return (
    <Popover placement="left" closeOnBlur={false}>
      <PopoverTrigger>
        {/* TODO tooltips don't play nice with Popovers */}
        <IconButton
          size="xs"
          variant="ghost"
          aria-label="Find PDA"
          icon={<FaRobot />}
        />
      </PopoverTrigger>

      {/* avoid z-index issues with it rendering before other compoents that may clash with it */}
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />

          <PopoverHeader>
            <Heading size="sm">Find PDA</Heading>
          </PopoverHeader>

          <PopoverBody>
            <Grid p="1">
              <FormLabel textAlign="center">Seeds</FormLabel>
              <Sortable
                itemOrder={seeds.order}
                setItemOrder={(order) => {
                  setSeeds((state) => {
                    state.order = order;
                  });
                }}
              >
                {toSortedArray(seeds).map((seed) => (
                  <SeedItem
                    seed={seed}
                    setSeed={(fn) => {
                      setSeeds((state) => {
                        fn(state.map[seed.id]);
                      });
                    }}
                    removeSeed={() => {
                      setSeeds((state) => {
                        removeFrom(state, seed.id);
                      });
                    }}
                  />
                ))}
              </Sortable>

              <Tooltip label="Add Seed">
                <IconButton
                  mt="1"
                  aria-label="Add Seed"
                  icon={<AddIcon />}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSeeds((state) => {
                      addTo(state, newSeedItem());
                    });
                  }}
                />
              </Tooltip>
            </Grid>
          </PopoverBody>

          <PopoverFooter>
            <Center>
              <Button
                size="sm"
                colorScheme="teal"
                leftIcon={<SearchIcon />}
                onClick={generate}
              >
                Find &amp; Add
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

const SeedItem: React.FC<{
  seed: Seed;
  setSeed: (fn: (state: Draft<Seed>) => void) => void;
  removeSeed: () => void;
}> = ({ seed, setSeed, removeSeed }) => {
  const { listeners, attributes } = useContext(SortableItemContext);

  return (
    <Flex alignItems="center" mb="1">
      <DragHandleIcon h="2.5" w="2.5" mr="1" {...attributes} {...listeners} />
      <Input
        placeholder="Seed"
        size="sm"
        value={seed.value}
        key={seed.id}
        onChange={(e) => {
          setSeed((state) => {
            state.value = e.target.value;
          });
        }}
      />
      <Tooltip label="Remove">
        <IconButton
          ml="1"
          size="xs"
          aria-label="Remove"
          icon={<CloseIcon />}
          variant="ghost"
          onClick={removeSeed}
        />
      </Tooltip>
    </Flex>
  );
};
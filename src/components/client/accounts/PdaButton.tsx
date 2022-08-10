import {
  AddIcon,
  CloseIcon,
  DragHandleIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  forwardRef,
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
import React, { useContext, useRef, useState } from "react";
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
  const initialFocusRef = useRef(null);
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
      toSortedArray(seeds)
        .filter((x) => x.value)
        .map((x) => Buffer.from(x.value)),
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
    <Popover
      placement="left"
      closeOnBlur={false}
      initialFocusRef={initialFocusRef}
      isLazy
    >
      <Tooltip label="Find PDA">
        {/* cannot use tooltips directly on trigger 
            https://github.com/chakra-ui/chakra-ui/issues/2843 */}
        <Box display="inline-block">
          <PopoverTrigger>
            {/* TODO tooltips don't play nice with Popovers */}
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Find PDA"
              icon={<FaRobot />}
            />
          </PopoverTrigger>
        </Box>
      </Tooltip>

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
                {toSortedArray(seeds).map((seed, index) => (
                  <SeedItem
                    key={index}
                    ref={initialFocusRef}
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

const SeedItem = forwardRef<
  {
    seed: Seed;
    setSeed: (fn: (state: Draft<Seed>) => void) => void;
    removeSeed: () => void;
  },
  "div"
>(({ seed, setSeed, removeSeed }, ref) => {
  const { listeners, attributes } = useContext(SortableItemContext);

  return (
    <Flex alignItems="center" mb="1">
      <DragHandleIcon h="2.5" w="2.5" mr="1" {...attributes} {...listeners} />
      <Input
        ref={ref}
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
});

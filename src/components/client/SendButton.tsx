import { TriangleDownIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  IconProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSendToClockwork } from "hooks/clockwork";
import { useSendToSquads } from "hooks/squads";
import { useConfigStore } from "hooks/useConfigStore";
import { useSendWeb3Transaction } from "hooks/useSendWeb3Transaction";
import {
  useSessionStoreWithUndo,
  useShallowSessionStoreWithoutUndo,
} from "hooks/useSessionStore";
import { TransactionBuilderArgs } from "hooks/useWeb3TranasctionBuilder";
import {
  extractBalancesFromSimulation,
  mapWeb3TransactionError,
} from "mappers/web3js-to-internal";
import React, { useMemo } from "react";
import { FaFlask, FaPlay } from "react-icons/fa";
import { IPubKey } from "types/internal";
import { RunType } from "types/state";
import { DEFAULT_TRANSACTION_RUN } from "utils/state";
import { SIMULATED_SIGNATURE } from "utils/ui-constants";

const SquadsIcon: React.FC<IconProps> = (props) => (
  <Icon w="5" h="5" viewBox="0 0 34 54" {...props}>
    <path
      d="M 33.14 19.106 L 28.535 14.501 L 24.902 10.861 C 24.833 10.793 24.76 10.727 24.686 10.666 C 24.161 10.237 23.504 10.001 22.825 10 L 11.176 10 C 10.498 10.001 9.841 10.236 9.316 10.666 C 9.241 10.727 9.169 10.793 9.1 10.861 L 5.468 14.493 L 0.863 19.099 C 0.59 19.372 0.373 19.696 0.225 20.053 C 0.077 20.41 0 20.793 0 21.179 L 0 32.828 C -0 33.215 0.076 33.598 0.224 33.955 C 0.372 34.312 0.59 34.636 0.863 34.909 L 9.1 43.148 C 9.169 43.217 9.241 43.282 9.316 43.334 C 9.841 43.764 10.498 43.999 11.176 44 L 22.825 44 C 23.504 43.999 24.161 43.763 24.686 43.334 C 24.76 43.273 24.833 43.207 24.902 43.148 L 33.139 34.909 C 33.412 34.636 33.628 34.311 33.776 33.954 C 33.924 33.597 34 33.215 34 32.828 L 34 21.179 C 33.998 20.402 33.689 19.657 33.14 19.106 Z M 29.509 27.018 L 29.509 36.784 C 29.508 37.144 29.436 37.5 29.298 37.832 C 29.159 38.164 28.957 38.466 28.702 38.719 C 28.447 38.973 28.144 39.174 27.811 39.311 C 27.479 39.447 27.122 39.517 26.762 39.516 L 7.226 39.516 C 6.867 39.516 6.511 39.445 6.179 39.308 C 5.847 39.17 5.545 38.969 5.291 38.715 C 5.036 38.46 4.835 38.159 4.697 37.827 C 4.56 37.494 4.489 37.138 4.49 36.779 L 4.49 17.242 C 4.489 16.882 4.56 16.526 4.697 16.194 C 4.835 15.861 5.036 15.559 5.291 15.305 C 5.545 15.051 5.846 14.849 6.179 14.711 C 6.511 14.574 6.867 14.503 7.226 14.503 L 26.762 14.503 C 27.489 14.503 28.185 14.791 28.699 15.305 C 29.213 15.819 29.501 16.515 29.501 17.242 L 29.501 27.02 Z"
      fill="currentColor"
    ></path>
  </Icon>
);

const ClockworkIcon: React.FC<IconProps> = (props) => (
  <Icon
    w="3.5"
    h="3.5"
    viewBox="0 0 40 40"
    ml="1" // icon is a bit off-centre compared to squads
    {...props}
  >
    <path
      d="m 34.1428,34.1508 c 0.6402,-0.6401 1.2323,-1.3202 1.7684,-2.0244 0.5761,-0.7521 0.3841,-1.8403 -0.4241,-2.3364 l -3.8648,-2.3685 c -0.6721,-0.4161 -1.5603,-0.2801 -2.0564,0.3361 -0.264,0.328 -0.5521,0.6481 -0.8561,0.9522 -0.3041,0.304 -0.6242,0.5921 -0.9522,0.8561 -0.6162,0.4961 -0.7522,1.3843 -0.3361,2.0564 l 2.3685,3.8648 c 0.4961,0.8082 1.5843,1.0002 2.3364,0.4241 0.6962,-0.5281 1.3763,-1.1202 2.0164,-1.7604 z"
      fill="#446df6"
    />
    <path
      d="m 40.008,19.996 c 0,0.9122 -0.064,1.8083 -0.176,2.6805 -0.128,0.9442 -1.0322,1.5683 -1.9524,1.3523 l -4.4089,-1.0562 c -0.7681,-0.1841 -1.2963,-0.9042 -1.2162,-1.6964 0.04,-0.424 0.064,-0.8481 0.064,-1.2802 0,-0.4321 -0.024,-0.8642 -0.064,-1.2803 -0.0801,-0.7841 0.4481,-1.5123 1.2162,-1.6963 l 4.4089,-1.0562 c 0.9202,-0.2241 1.8244,0.4081 1.9524,1.3523 0.112,0.8721 0.176,1.7683 0.176,2.6805 z"
      fill="#1dd3b0"
    />
    <path
      d="m 34.1428,5.84115 c 0.6402,0.64013 1.2323,1.32026 1.7684,2.0244 0.5761,0.75215 0.3841,1.84037 -0.4241,2.33645 l -3.8648,2.3685 c -0.6721,0.4161 -1.5603,0.28 -2.0564,-0.3361 -0.264,-0.328 -0.5521,-0.6481 -0.8561,-0.9522 -0.3041,-0.304 -0.6242,-0.5921 -0.9522,-0.8561 C 27.1414,9.92996 27.0054,9.04179 27.4215,8.36965 L 29.79,4.50488 c 0.4961,-0.80816 1.5843,-1.0002 2.3364,-0.42409 0.6962,0.52811 1.3763,1.12023 2.0164,1.76036 z"
      fill="#ff4242"
    />
    <path
      d="m 22.9726,33.4627 c -0.176,-0.7202 -0.8242,-1.2403 -1.5523,-1.2323 h -0.008 c -0.04,0 -0.088,0 -0.136,0.008 -0.2081,0.0241 -0.4161,0.0401 -0.6242,0.0561 0,0 -0.008,0 -0.016,0 -0.208,0.008 -0.4241,0.016 -0.6401,0.016 -2.1764,0 -4.2248,-0.5682 -6.0012,-1.5603 -0.088,-0.0481 -0.176,-0.0961 -0.2561,-0.1441 -0.088,-0.048 -0.168,-0.104 -0.256,-0.152 -0.08,-0.056 -0.168,-0.104 -0.2481,-0.16 -0.08,-0.0561 -0.16,-0.1121 -0.248,-0.1681 -0.136,-0.096 -0.2721,-0.192 -0.4081,-0.296 -0.088,-0.064 -0.176,-0.1361 -0.264,-0.2001 -0.1281,-0.104 -0.2561,-0.208 -0.3841,-0.32 -0.072,-0.0641 -0.152,-0.1281 -0.2241,-0.2001 -0.032,-0.032 -0.072,-0.064 -0.112,-0.096 -0.104,-0.104 -0.216,-0.2 -0.32,-0.3041 -2.23249,-2.2324 -3.60877,-5.305 -3.60877,-8.7057 0,-0.3361 0.01601,-0.6721 0.04001,-1.0082 C 8.17763,13.0986 12.8666,8.35367 18.7157,7.75355 19.1318,7.71354 19.5559,7.68954 19.98,7.68954 c 0.4321,0 0.8642,0.024 1.2803,0.06401 0.7841,0.08002 1.5123,-0.44809 1.6963,-1.21624 L 24.0128,2.12843 C 24.2368,1.20824 23.6047,0.304059 22.6605,0.176034 22.3325,0.128024 22.0044,0.0960187 21.6683,0.0720139 21.5323,0.0640123 21.3963,0.0480096 21.2603,0.040008 21.1722,0.0320064 21.0842,0.0320054 20.9962,0.0240038 20.6601,0.00800062 20.3161,0 19.98,0 c -0.112,0 -0.224,0 -0.3361,0 -0.096,0 -0.2,4.8826e-7 -0.296,0.00800209 -0.024,0 -0.048,0 -0.072,0 -0.0801,0 -0.1681,0.00799961 -0.2481,0.00799961 -0.112,0.0080016 -0.224,0.0080026 -0.3281,0.0160042 -0.056,0 -0.112,0.0080021 -0.168,0.0080021 -0.064,0 -0.128,0.0080001 -0.192,0.0160017 -0.016,0 -0.04,5e-7 -0.056,0.0080021 -0.0961,0.0080016 -0.1921,0.0160047 -0.2801,0.0240063 -0.144,0.0160029 -0.2801,0.0320049 -0.4241,0.0480079 -0.072,0.008001 -0.136,0.016004 -0.208,0.024006 -0.016,0 -0.04,0.008002 -0.056,0.008002 -0.008,0 -0.016,0 -0.016,0 C 7.52951,1.4963 0,9.86597 0,19.996 c 0,10.098 7.4815,18.4517 17.2034,19.812 0.032,0.008 0.0721,0.016 0.1041,0.016 0.8801,0.12 1.7763,0.176 2.6805,0.176 0.9042,0 1.8004,-0.064 2.6805,-0.176 0.008,0 0.016,0 0.032,-0.008 0.016,0 0.032,-0.008 0.04,-0.008 0.8962,-0.1601 1.4883,-1.0403 1.2723,-1.9444 z"
      fill="currentColor"
    />
  </Icon>
);

export const RUN_TYPES: {
  id: RunType;
  type: "standard" | "integration";
  name: string;
  icon: JSX.Element;
}[] = [
  { id: "send", name: "Send", type: "standard", icon: <Icon as={FaPlay} /> },
  {
    id: "squads",
    name: "Send to Squads",
    type: "integration",
    icon: <SquadsIcon />,
  },
  {
    id: "clockwork",
    name: "Send to Clockwork",
    type: "integration",
    icon: <ClockworkIcon />,
  },
];

export const SendButton: React.FC<{
  startGet: (signature: IPubKey, skipPolling?: boolean) => void;
  resultsRef: React.RefObject<HTMLDivElement>;
}> = ({ startGet, resultsRef }) => {
  const scrollToResults = useConfigStore(
    (state) => state.appOptions.scrollToResults
  );
  const [runType, simulate, inProgress, setUI] =
    useShallowSessionStoreWithoutUndo((state) => [
      state.uiState.runType,
      state.uiState.simulate,
      state.transactionRun.inProgress,
      state.set,
    ]);

  const { publicKey: walletPublicKey } = useWallet();

  const { name: runName, icon: runIcon } = useMemo(
    () => RUN_TYPES.find(({ id }) => runType === id)!,
    [runType]
  );

  // TODO causes component reload
  const transaction = useSessionStoreWithUndo((state) => state.transaction);

  const scrollDown = () => {
    if (scrollToResults) {
      resultsRef.current?.scrollIntoView({
        block: "end",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  };

  const onSimulated: TransactionBuilderArgs["onSimulated"] = (
    response,
    { transaction, recentBlockhash, lastValidBlockHeight }
  ) => {
    setUI((state) => {
      state.transactionRun = {
        inProgress: false,
        signature: SIMULATED_SIGNATURE,
        confirmationStatus: "simulated",
        confirmations: 0,
        lastValidBlockHeight,
        recentBlockhash,
        error: mapWeb3TransactionError(response.value.err),
        logs: response.value.logs ?? [],
        unitsConsumed: response.value.unitsConsumed,
        slot: response.context.slot,
        balances: extractBalancesFromSimulation(
          response.value,
          transaction.message
        ),
        // TODO returnData
      };
    });
    scrollDown();
  };

  const onSent: TransactionBuilderArgs["onSent"] = (
    signature,
    { recentBlockhash, lastValidBlockHeight }
  ) => {
    setUI((state) => {
      state.transactionRun.signature = signature;
      state.transactionRun.recentBlockhash = recentBlockhash;
      state.transactionRun.lastValidBlockHeight = lastValidBlockHeight;
    });
    startGet(signature);
    scrollDown();
  };

  const onError: TransactionBuilderArgs["onError"] = (error) => {
    setUI((state) => {
      state.transactionRun.inProgress = false;
      state.transactionRun.error = error.message;
    });
    scrollDown();
  };

  const { simulate: sendSimulate, send } = useSendWeb3Transaction({
    onSimulated,
    onSent,
    onError,
  });

  const { simulate: squadsSimulate, send: squadsSend } = useSendToSquads({
    onSimulated,
    onSent,
    onError,
  });

  const { simulate: clockworkSimulate, send: clockworkSend } =
    useSendToClockwork({
      onSimulated,
      onSent,
      onError,
    });

  const onClick = () => {
    setUI((state) => {
      state.transactionRun = {
        ...DEFAULT_TRANSACTION_RUN,
        inProgress: true,
      };
    });

    if (runType === "send" && simulate) {
      sendSimulate(transaction);
    } else if (runType === "send" && !simulate) {
      send(transaction);
    } else if (runType === "squads" && simulate) {
      squadsSimulate(transaction);
    } else if (runType === "squads" && !simulate) {
      squadsSend(transaction);
    } else if (runType === "clockwork" && simulate) {
      clockworkSimulate(transaction);
    } else if (runType === "clockwork" && !simulate) {
      clockworkSend(transaction);
    }
  };

  const menuItems = (items: typeof RUN_TYPES) =>
    items.map(({ id, name, icon }, index) => (
      <MenuItem
        key={index}
        icon={icon}
        onClick={() => {
          setUI((state) => {
            state.uiState.runType = id;
          });
        }}
      >
        {name}
      </MenuItem>
    ));

  return (
    <Tooltip
      shouldWrapChildren
      hasArrow={!walletPublicKey}
      label={
        walletPublicKey
          ? simulate
            ? "Simulate transaction"
            : "Send transaction"
          : "Please connect a wallet to continue"
      }
    >
      <ButtonGroup isAttached>
        <Button
          isLoading={inProgress}
          isDisabled={!walletPublicKey}
          ml="2"
          w="fit-content"
          colorScheme="green"
          aria-label="Send transaction"
          rightIcon={simulate ? <Icon as={FaFlask} /> : runIcon}
          boxShadow={!simulate ? "0 0 8px 1px #9AE6B4" : undefined}
          onClick={onClick}
        >
          {runName}
        </Button>
        <Menu placement="right-start">
          <MenuButton
            as={IconButton}
            minW="5"
            mr="2"
            variant="outline"
            colorScheme="green"
            aria-label="More"
            boxShadow={!simulate ? "0 0 8px 1px #9AE6B4" : undefined}
            icon={<TriangleDownIcon w="2" />}
            isDisabled={!walletPublicKey}
          />
          <MenuList fontSize="md">
            {menuItems(RUN_TYPES.filter(({ type }) => type === "standard"))}
            <MenuDivider />
            <MenuGroup title="Integrations">
              {menuItems(
                RUN_TYPES.filter(({ type }) => type === "integration")
              )}
            </MenuGroup>
          </MenuList>
        </Menu>
      </ButtonGroup>
    </Tooltip>
  );
};

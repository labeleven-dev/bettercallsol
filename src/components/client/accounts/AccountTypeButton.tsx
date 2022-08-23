import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaCog,
  FaCoins,
  FaDiaspora,
  FaInfo,
  FaKey,
  FaRobot,
  FaWallet,
} from "react-icons/fa";
import { useAccount } from "../../../hooks/useAccount";
import { useAccountType } from "../../../hooks/useAccountType";
import { AccountTypeType } from "../../../types/internal";

const TYPES: AccountTypeType[] = [
  "wallet",
  "keypair",
  "pda",
  "ata",
  "program",
  "sysvar",
  "unspecified",
];

const TYPE_CONFIGS: Record<AccountTypeType, any> = {
  unspecified: {
    name: "Unspecified",
    icon: <Icon as={FaDiaspora} />,
  },
  wallet: {
    name: "Wallet",
    icon: <Icon as={FaWallet} />,
  },
  keypair: {
    name: "New Keypair",
    icon: <Icon as={FaKey} />,
  },
  pda: {
    name: "PDA",
    icon: <Icon as={FaRobot} />,
  },
  ata: {
    name: "Assoc. Token Account",
    icon: <Icon as={FaCoins} />,
  },
  program: {
    name: "Program",
    icon: <Icon as={FaCog} />,
  },
  sysvar: {
    name: "Sysvar",
    icon: <Icon as={FaInfo} />,
  },
};

export const AccountTypeButton: React.FC = () => {
  const { update } = useAccount();
  const { type, allPopulate } = useAccountType();

  const { name: selectedName, icon: selectedIcon } = TYPE_CONFIGS[type];

  const onClick = (type: AccountTypeType) => () => {
    update((state) => {
      state.type = {
        type,
        config:
          type === "pda"
            ? { seeds: [] }
            : type === "ata"
            ? { mint: "" }
            : undefined,
      };
    });
    // only populates for account types that receieve no config,
    // e.g. wallet or new key pair
    allPopulate[type]();

    // TODO open the config collapse thing
  };

  return (
    <Menu>
      <Tooltip label={selectedName}>
        <MenuButton
          pl="1"
          pr="1"
          as={IconButton}
          color="gray.400"
          variant="ghost"
          size="xs"
          icon={selectedIcon}
          rightIcon={<ChevronDownIcon />}
        />
      </Tooltip>
      <Portal>
        <MenuList fontSize="sm" zIndex="modal">
          {TYPES.map((type, index) => {
            const { name, icon } = TYPE_CONFIGS[type];

            return (
              <MenuItem
                icon={
                  <>
                    {/* TODO if selected add a tick to icon too */}
                    {icon}
                  </>
                }
                key={index}
                onClick={onClick(type)}
              >
                {name}
              </MenuItem>
            );
          })}
        </MenuList>
      </Portal>
    </Menu>
  );
};

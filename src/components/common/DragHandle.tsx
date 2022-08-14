import { DragHandleIcon, LockIcon } from "@chakra-ui/icons";
import { IconProps, useColorModeValue } from "@chakra-ui/react";
import { useContext } from "react";
import { SortableItemContext } from "./Sortable";

export const DragHandle: React.FC<{
  locked?: boolean;
  unlockedProps?: IconProps;
  lockedProps?: IconProps;
}> = ({ locked = false, unlockedProps, lockedProps }) => {
  const { listeners, attributes } = useContext(SortableItemContext);
  const lockIconColor = useColorModeValue("gray.300", "gray.600");

  return locked ? (
    <LockIcon color={lockIconColor} {...lockedProps} />
  ) : (
    <DragHandleIcon {...unlockedProps} {...attributes} {...listeners} />
  );
};

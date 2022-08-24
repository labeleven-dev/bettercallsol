import {
  Box,
  BoxProps,
  Input,
  InputProps,
  List,
  ListItem,
  useColorModeValue,
} from "@chakra-ui/react";
import type { AriaListBoxOptions } from "@react-aria/listbox";
import type { ComboBoxProps } from "@react-types/combobox";
import type { Node } from "@react-types/shared";
import { useEffect, useRef } from "react";
import {
  DismissButton,
  FocusScope,
  OverlayContainer,
  useComboBox,
  useFilter,
  useListBox,
  useOption,
  useOverlay,
  useOverlayPosition,
} from "react-aria";
import type { ListState } from "react-stately";
import { useComboBoxState } from "react-stately";

export { Item as AutoCompleteItem } from "react-stately";

// I would use Chakra menu instead but it is too coupled with the trigger button :(

/**
 * Combo box / auto-complete
 *
 * @see https://react-spectrum.adobe.com/react-aria/useComboBox.html
 */
export const Autocomplete = <T extends object>({
  chakraInputProps,
  autoFocusSingleOption = true,
  ...props
}: {
  chakraInputProps?: InputProps;
  // if there is only one option available, then automatically focus on it
  autoFocusSingleOption?: boolean;
} & ComboBoxProps<T>) => {
  let { contains } = useFilter({ sensitivity: "base" });
  let state = useComboBoxState({
    ...props,
    defaultFilter: contains,
  });

  useEffect(() => {
    if (autoFocusSingleOption && state.collection.size === 1) {
      state.selectionManager.setFocusedKey(state.collection.getFirstKey()!);
    }
  }, [autoFocusSingleOption, state.collection, state.selectionManager]);

  let inputRef = useRef<HTMLInputElement>(null);
  let listBoxRef = useRef(null);
  let popoverRef = useRef(null);

  let { inputProps, listBoxProps } = useComboBox(
    {
      ...props,
      inputRef,
      listBoxRef,
      popoverRef,
    },
    state
  );

  let { overlayProps } = useOverlayPosition({
    targetRef: inputRef,
    overlayRef: popoverRef,
    placement: "bottom left",
    offset: 5,
    isOpen: state.isOpen,
  });

  return (
    <Box display="inline-block" position="relative" w="100%">
      <Input
        {...inputProps}
        {...chakraInputProps}
        ref={inputRef}
        // not sure why it has to be last?
        size={chakraInputProps?.size || "md"}
      />

      {state.isOpen && (
        <OverlayContainer>
          <Popover
            {...overlayProps}
            popoverRef={popoverRef}
            isOpen={state.isOpen}
            onClose={state.close}
            // match the width of the input field
            w={inputRef.current?.offsetWidth}
          >
            <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
          </Popover>
        </OverlayContainer>
      )}
    </Box>
  );
};

const ListBox = (
  props: {
    listBoxRef?: React.RefObject<HTMLUListElement>;
    state: ListState<unknown>;
  } & AriaListBoxOptions<unknown>
) => {
  let ref = useRef<HTMLUListElement>(null);
  let { listBoxRef = ref, state } = props;
  let { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <List
      {...listBoxProps}
      ref={listBoxRef}
      overflow="auto"
      maxHeight="300"
      my="1"
      display="flex"
      flexDirection="column"
    >
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </List>
  );
};

const Option = ({
  item,
  state,
}: {
  item: Node<unknown>;
  state: ListState<unknown>;
}) => {
  let ref = useRef<HTMLLIElement>(null);
  let { optionProps, isSelected, isFocused } = useOption(
    {
      key: item.key,
    },
    state,
    ref
  );

  const focusedBacground = useColorModeValue("gray.100", "whiteAlpha.100");

  return (
    <ListItem
      {...optionProps}
      as="li"
      ref={ref}
      px="2"
      py="2"
      background={isFocused ? focusedBacground : "transparent"}
      color="chakra-body-text"
      fontWeight={isSelected ? "bold" : "normal"}
      cursor="default"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      {item.rendered}
    </ListItem>
  );
};

const Popover = (
  props: {
    popoverRef?: React.RefObject<HTMLDivElement>;
    children: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
  } & BoxProps
) => {
  let ref = useRef<HTMLDivElement>(null);
  let { popoverRef = ref, isOpen, onClose, children, ...otherProps } = props;

  // Handle events that should cause the popup to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  let { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      shouldCloseOnBlur: true,
      isDismissable: true,
    },
    popoverRef
  );

  // Add a hidden <DismissButton> component at the end of the popover
  // to allow screen reader users to dismiss the popup easily.
  return (
    <FocusScope restoreFocus>
      <Box
        {...otherProps}
        {...overlayProps}
        ref={popoverRef}
        background={useColorModeValue("#fff", "gray.700")}
        borderWidth="1px"
        borderStyle="solid"
        borderColor="chakra-border-color"
        borderRadius="md"
        boxShadow={useColorModeValue("sm", "dark-lg")}
      >
        {children}
        <DismissButton onDismiss={onClose} />
      </Box>
    </FocusScope>
  );
};

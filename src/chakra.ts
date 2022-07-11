import { ButtonProps } from "@chakra-ui/react";

// Redefine IconButtonProps but with optional aria-label, as it is often set by the custom button itself
// Upgrade note: check if this is aligned every time we upgrade chakra

declare type OmittedProps =
  | "leftIcon"
  | "rightIcon"
  | "loadingText"
  | "iconSpacing"
  | "spinnerPlacement";
interface BaseButtonProps extends Omit<ButtonProps, OmittedProps> {}
export interface CustomIconButtonProps extends BaseButtonProps {
  /**
   * The icon to be used in the button.
   * @type React.ReactElement
   */
  icon?: React.ReactElement;
  /**
   * If `true`, the button will be perfectly round. Else, it'll be slightly round
   */
  isRound?: boolean;
  /**
   * A11y: A label that describes the button
   */
  "aria-label"?: string;
}

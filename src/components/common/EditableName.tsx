import {
  Editable,
  EditableInput,
  EditableInputProps,
  EditablePreview,
  EditablePreviewProps,
  EditableProps,
  Tooltip,
  TooltipProps,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useRef } from "react";

export const EditableName: React.FC<
  {
    tooltip?: string;
    tooltipProps?: Omit<TooltipProps, "children">;
    previewProps?: EditablePreviewProps;
    inputProps?: EditableInputProps;
  } & EditableProps
> = ({
  tooltip,
  tooltipProps,
  previewProps,
  inputProps,
  width,
  value,
  isDisabled,
  ...theRest
}) => {
  const previewRef = useRef<HTMLSpanElement>(null);
  const unnamedColor = useColorModeValue("blackAlpha.400", "whiteAlpha.400");
  const hoverStyle = {
    background: useColorModeValue("blackAlpha.100", "whiteAlpha.100"),
  };

  // TODO only show tooltip if truncated
  // const [truncated, setTruncated] = useState(false);
  // useEffect(() => {
  //   const preview = previewRef.current;
  //   if (preview) {
  //     setTruncated(
  //       preview.offsetWidth < preview.scrollWidth ||
  //         preview.offsetHeight < preview.scrollHeight
  //     );
  //   }
  // });

  return (
    <Tooltip
      label={tooltip || (value ? previewRef.current?.innerText : "")}
      {...tooltipProps}
    >
      <Editable value={value} isDisabled={isDisabled} {...theRest}>
        <EditablePreview
          p="1"
          ref={previewRef}
          color={value ? undefined : unnamedColor}
          noOfLines={1} // TODO ellipses don't apear on truncating words
          minW={width || undefined}
          maxW={width || undefined}
          _hover={isDisabled ? {} : hoverStyle}
          {...previewProps}
        />
        <EditableInput p="1" {...inputProps} />
      </Editable>
    </Tooltip>
  );
};

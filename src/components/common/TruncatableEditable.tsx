import {
  Editable,
  EditableInput,
  EditablePreview,
  EditableProps,
  Tooltip,
} from "@chakra-ui/react";
import React, { useRef } from "react";

export const TruncatableEditable: React.FC<
  {
    width?: string;
  } & EditableProps
> = ({ width, ...theRest }) => {
  const previewRef = useRef<HTMLSpanElement>(null);

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
    <Tooltip label={previewRef.current?.innerText}>
      <Editable {...theRest} maxW={width}>
        <EditablePreview
          ref={previewRef}
          noOfLines={1}
          minH="23px"
          minW={width}
          maxW={width}
        />
        <EditableInput minW={width} maxW={width} />
      </Editable>
    </Tooltip>
  );
};

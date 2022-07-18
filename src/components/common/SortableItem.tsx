import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

/**
 * Each sortable item should accept these props
 *
 * `id` should be provided by user. The rest is set by `<SortableItem>`
 */
export type SortableItemProps = {
  id: string;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  setNodeRef?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
};

// This has to be its own component that user wraps the items in,
// in case the actual sortable item is not an immediate child, i.e.
// a few levels down.

/**
 * Each sortable item inside `<Sortable>` should be wrapped in this.
 */
export const SortableItem: React.FC<{
  children: React.ReactElement<SortableItemProps>;
}> = ({ children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: children.props.id,
      animateLayoutChanges: (args) =>
        defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return React.cloneElement(children, {
    attributes,
    listeners,
    setNodeRef,
    style,
  });
};

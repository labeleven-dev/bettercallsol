import { Box } from "@chakra-ui/react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DraggableAttributes,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  defaultAnimateLayoutChanges,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { IID } from "../../types/sortable";

export const SortableItemContext = React.createContext<{
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}>({});

/**
 * Makes the children into a drag-n-drop sortable vertical list.
 *
 * The only thing the child items need to do is to explode `attributes`
 * and `listeners` from `SortableItemContext` into the drag handle.
 *
 * See `<Accounts>` and `<Account>` for an example.
 */
export const Sortable: React.FC<{
  itemOrder: IID[];
  setItemOrder: (itemOrder: IID[]) => void;
  children: React.ReactNode;
}> = ({ itemOrder, setItemOrder, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (active.id !== over?.id) {
      setItemOrder(
        arrayMove(
          itemOrder,
          itemOrder.indexOf(active.id as IID),
          itemOrder.indexOf(over?.id as IID)
        )
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      collisionDetection={closestCenter}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemOrder} strategy={verticalListSortingStrategy}>
        {React.Children.map(children, (child, index) => (
          <SortableItem id={itemOrder[index]} key={itemOrder[index]}>
            {child}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

const SortableItem: React.FC<{
  id: IID;
  children: React.ReactNode;
}> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      animateLayoutChanges: (args) =>
        defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <SortableItemContext.Provider value={{ attributes, listeners }}>
        {children}
      </SortableItemContext.Provider>
    </Box>
  );
};

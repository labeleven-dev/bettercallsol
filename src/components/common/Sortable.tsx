import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import { IID } from "../../models/sortable";

export const SortableItemContext = React.createContext("");

/**
 * Sortable container. All sortable items should be under this.
 *
 * For this to work ensure that:
 *   - Each item is wrapped in `<Sortable>`
 *   - Each item accepts `SortableItemProps`
 *
 * See `<Accounts>` and `<Account>` for an example
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
          <SortableItemContext.Provider value={itemOrder[index]}>
            {child}
          </SortableItemContext.Provider>
        ))}
      </SortableContext>
    </DndContext>
  );
};

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
import { IID } from "../../web3";

export const Sortable: React.FC<{
  itemOrder: IID[];
  setItemOrder: (itemOrder: IID[]) => void;
  children: React.ReactFragment;
}> = ({ itemOrder, setItemOrder, children }) => {
  // const [items, setItems] = useState(itemOrder);

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
        {children}
      </SortableContext>
    </DndContext>
  );
};

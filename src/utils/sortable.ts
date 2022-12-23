import { WritableDraft } from "immer/dist/internal";
import { Identifiable, IID, SortableCollection } from "types/sortable";

export const addTo = <T extends Identifiable>(
  collection: SortableCollection<T> | WritableDraft<SortableCollection<T>>,
  item: T
) => {
  collection.map[item.id] = item;
  collection.order.push(item.id);
};

export const toSortableCollection = <T extends Identifiable>(
  items: T[]
): SortableCollection<T> => {
  const collection: SortableCollection<T> = {
    map: {},
    order: [],
  };
  items.forEach((item) => {
    addTo(collection, item);
  });
  return collection;
};

export const removeFrom = <T extends Identifiable>(
  collection: SortableCollection<T> | WritableDraft<SortableCollection<T>>,
  itemId: IID
) => {
  collection.order = collection.order.filter((x) => x !== itemId);
  delete collection.map[itemId];
};

export const toSortedArray = <T extends Identifiable>(
  collection: SortableCollection<T>
) => collection.order.map((id) => collection.map[id]);

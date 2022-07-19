// deal with sortable/draggable collections uniformly
// should ideally be a class but having trouble making it work with immer

import { WritableDraft } from "immer/dist/internal";

export type IID = string;

export type Identifiable = {
  id: IID;
};

export interface SortableCollection<T extends Identifiable> {
  map: Record<IID, T>;
  order: IID[];
}

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

export const toOrderedArray = <T extends Identifiable>(
  collection: SortableCollection<T>
) => collection.order.map((id) => collection.map[id]);

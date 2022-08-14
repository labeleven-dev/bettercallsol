// deal with sortable/draggable collections uniformly

export type IID = string;

export type Identifiable = {
  id: IID;
};

export interface SortableCollection<T extends Identifiable> {
  map: Record<IID, T>;
  order: IID[];
}

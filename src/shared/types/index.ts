// Shared types
export type ConfigKeys = "VITE_API_URL_SERVER";

export interface GenericDataResponse<T> {
  data: T;
  errors?: Record<string, string>;
}

export interface SortableItem {
  id: string | number;
  order: number;
}

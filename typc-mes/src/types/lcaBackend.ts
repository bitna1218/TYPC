export type ApiResponse<T = string> = {
  resultCode: string;
  result: T;
};

export type PaginationData<T> = {
  content: T[];
  total_elements: number;
  total_pages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  number_of_elements: number;
};

export type ApiPaginationResponse<T> = ApiResponse<PaginationData<T>>;

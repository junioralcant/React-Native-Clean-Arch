export type GetParams = {
  url: string;
  headers?: any;
  params?: Record<string, string | number | null>;
  queryString?: Record<string, string | number | null>;
};

export interface HttpGetClient {
  get<T>(params: GetParams): Promise<T>;
}

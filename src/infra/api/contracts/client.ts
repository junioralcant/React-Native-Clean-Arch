export enum StatusCode {
  Success = 200,
  BadRequestError = 400,
  UnauthorizedError = 401,
  ForbiddenError = 403,
  NotFoundError = 404,
  ServerError = 500,
}

export type HttpResponse<TData = any> = {
  statusCode: number;
  data: TData;
};

export interface IClient<T = any> {
  get(url: string, headers?: any): Promise<HttpResponse<T>>;
}

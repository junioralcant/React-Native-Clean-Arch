import { HttpAdapter } from "../../../../../infra/api/adapters/http_adapter";
import { HttpAdapterAxios } from "../../../../../infra/api/adapters/http_adapter_axios";

export const makeHttpClient = () => {
  const httpClientAxios = new HttpAdapterAxios();
  return new HttpAdapter(httpClientAxios);
};
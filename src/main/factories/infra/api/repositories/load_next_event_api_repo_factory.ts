import { LoadNextEventApiRepository } from "../../../../../infra/api/repositories/load_next_event_api_repo";
import { makeHttpClient } from "../adapters/http_adapter_factory";

export const makeLoadNextEventApiRepository = () => {
  const httpClient = makeHttpClient();
  return new LoadNextEventApiRepository(httpClient, 'http://10.0.2.2:3000/api/groups/:groupId/next_event');
};
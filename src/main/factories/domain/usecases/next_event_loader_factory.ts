import { NextEventLoaderUseCase } from "../../../../domain/usecases/next_envent_loader";
import { makeLoadNextEventApiRepository } from "../../infra/api/repositories/load_next_event_api_repo_factory";

export const makeNextEventLoaderUseCase = () => {
  const repo = makeLoadNextEventApiRepository();
  return new NextEventLoaderUseCase(repo);
};
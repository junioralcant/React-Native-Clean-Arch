import { NextEventPresenter } from "../../../../presentation/presenters/next_event_presenter";
import { NextEventPage } from "../../../../ui/screens/NextEventPage";
import { makeNextEventLoaderUseCase } from "../../domain/usecases/next_event_loader_factory";

export const makeNextEventPage = () => {
  const nextEventLoadedUseCase = makeNextEventLoaderUseCase();
  const presenter = new NextEventPresenter(nextEventLoadedUseCase);
  return <NextEventPage presenter={presenter} groupId="valid_id" />;
};

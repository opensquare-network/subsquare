import {
  CollectivesApiProvider,
  useCollectivesApi,
} from "next-common/context/collectives/api";
import CollapsePanel, { AlwaysVisible } from "../collapsePanel";
import EvidenceTodo from "./evidenceTodo";
import NavigationButtons from "./navigationButtons";
import CollectivesProvider, {
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";

function Title() {
  return (
    <div className="flex gap-1 text14Medium text-textTertiary">
      <span>Fellowship To-do List</span>
      <span>·</span>
      <span>0</span>
    </div>
  );
}

function TodoList({ children }) {
  return <div className="flex flex-col mt-[16px] gap-[4px]">{children}</div>;
}

function FellowshipTodoListImpl() {
  const collectivesApi = useCollectivesApi();
  const referendaPallet = useReferendaFellowshipPallet();
  return (
    <ActiveReferendaProvider pallet={referendaPallet} api={collectivesApi}>
      <CollapsePanel labelItem={<Title />}>
        <AlwaysVisible>
          <NavigationButtons />
        </AlwaysVisible>
        <TodoList>
          <EvidenceTodo />
        </TodoList>
      </CollapsePanel>
    </ActiveReferendaProvider>
  );
}

export default function FellowshipTodoList() {
  return (
    <CollectivesProvider section="fellowship">
      <CollectivesApiProvider>
        <FellowshipTodoListImpl />
      </CollectivesApiProvider>
    </CollectivesProvider>
  );
}

import {
  CollectivesApiProvider,
  useCollectivesApi,
} from "next-common/context/collectives/api";
import CollapsePanel, { AlwaysVisible } from "../collapsePanel";
import ToDoItems from "./todoItems";
import NavigationButtons from "./navigationButtons";
import CollectivesProvider, {
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import {
  FellowshipToDoListProvider,
  useFellowshipTodoListData,
} from "./context";
import { CollectivesBlockHeightProvider } from "./collectives";
import Loading from "next-common/components/loading";

function Title() {
  const { todo, isLoading } = useFellowshipTodoListData();
  const todoItemCount = Object.entries(todo).filter(
    ([, shouldShow]) => shouldShow,
  ).length;
  return (
    <div className="flex items-center gap-1 text14Medium text-textTertiary">
      <span>Fellowship To-do List</span>
      <span>·</span>
      {isLoading ? <Loading size={16} /> : <span>{todoItemCount}</span>}
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
      <FellowshipToDoListProvider>
        <CollapsePanel labelItem={<Title />}>
          <AlwaysVisible>
            <NavigationButtons />
          </AlwaysVisible>
          <TodoList>
            <ToDoItems />
          </TodoList>
        </CollapsePanel>
      </FellowshipToDoListProvider>
    </ActiveReferendaProvider>
  );
}

export default function FellowshipTodoList() {
  return (
    <CollectivesProvider section="fellowship">
      <CollectivesApiProvider>
        <CollectivesBlockHeightProvider>
          <FellowshipTodoListImpl />
        </CollectivesBlockHeightProvider>
      </CollectivesApiProvider>
    </CollectivesProvider>
  );
}

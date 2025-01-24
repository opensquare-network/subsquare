import CollapsePanel, { AlwaysVisible } from "../collapsePanel";
import TodoList from "./todoList";
import NavigationButtons from "./navigationButtons";
import CollectivesProvider, {
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import {
  FellowshipToDoListProvider,
  useFellowshipTodoListData,
} from "./context";
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

function FellowshipTodoListImpl() {
  const referendaPallet = useReferendaFellowshipPallet();
  return (
    <ActiveReferendaProvider pallet={referendaPallet}>
      <FellowshipToDoListProvider>
        <CollapsePanel labelItem={<Title />}>
          <AlwaysVisible>
            <NavigationButtons />
          </AlwaysVisible>
          <TodoList />
        </CollapsePanel>
      </FellowshipToDoListProvider>
    </ActiveReferendaProvider>
  );
}

export default function FellowshipTodoList() {
  return (
    <CollectivesProvider section="fellowship">
      <FellowshipTodoListImpl />
    </CollectivesProvider>
  );
}

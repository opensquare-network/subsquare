import CollapsePanel, { AlwaysVisible } from "../collapsePanel";
import TodoList from "./todoList";
import NavigationButtons from "./navigationButtons";
import CollectivesProvider, {
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import {
  FellowshipTodoListProvider,
  useFellowshipTodoListCount,
  useFellowshipTodoListLoading,
} from "./context";
import Loading from "next-common/components/loading";

function Title() {
  const isLoading = useFellowshipTodoListLoading();
  const count = useFellowshipTodoListCount();
  return (
    <div className="flex items-center gap-1 text14Medium text-textTertiary">
      <span>Fellowship To-do List</span>
      <span>·</span>
      {isLoading ? <Loading size={16} /> : <span>{count}</span>}
    </div>
  );
}

function FellowshipTodoListImpl() {
  const referendaPallet = useReferendaFellowshipPallet();
  return (
    <ActiveReferendaProvider pallet={referendaPallet}>
      <FellowshipTodoListProvider>
        <CollapsePanel labelItem={<Title />}>
          <AlwaysVisible>
            <NavigationButtons />
          </AlwaysVisible>
          <TodoList />
        </CollapsePanel>
      </FellowshipTodoListProvider>
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

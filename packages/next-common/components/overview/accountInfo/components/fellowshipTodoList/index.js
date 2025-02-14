import CollapsePanel, { AlwaysVisible } from "../collapsePanel";
import TodoList from "./todoList";
import NavigationButtons from "./navigationButtons";
import CollectivesProvider, {
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import Loading from "next-common/components/loading";
import MyEvidenceProvider from "./context/myEvidence";
import MyMemberDataProvider from "./context/myMemberDataProvider";
import MyDemotionExpirationProvider from "./context/myDemotionExpirationProvider";
import useTodoListCount from "./hooks/useTodoListCount";
import useTodoListLoading from "./hooks/useTodoListLoading";
import DemotionExpirationCountProvider from "./context/demotionExpirationCount";

function Title() {
  const isLoading = useTodoListLoading();
  const count = useTodoListCount();
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
      <MyEvidenceProvider>
        <MyMemberDataProvider>
          <MyDemotionExpirationProvider>
            <DemotionExpirationCountProvider>
              <CollapsePanel labelItem={<Title />} defaultCollapsed={false}>
                <AlwaysVisible>
                  <NavigationButtons />
                </AlwaysVisible>
                <TodoList />
              </CollapsePanel>
            </DemotionExpirationCountProvider>
          </MyDemotionExpirationProvider>
        </MyMemberDataProvider>
      </MyEvidenceProvider>
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

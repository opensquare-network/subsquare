import CollapsePanel, { AlwaysVisible } from "../collapsePanel";
import NavigationButtons from "./navigationButtons";
import CollectivesProvider from "next-common/context/collectives/collectives";
import useTodoListLoading from "./hooks/useTodoListLoading";
import FellowshipTodoProviders from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context";
import LoadableContent, {
  LoadStyles,
} from "next-common/components/common/loadableContent";
import dynamicPopup from "next-common/lib/dynamic/popup";

const TodoList = dynamicPopup(() => import("./todoList"));

function Title() {
  const isLoading = useTodoListLoading();

  return (
    <div className="flex items-center gap-1 text14Medium text-textTertiary">
      <span>Fellowship To-do List</span>
      {/*<span>·</span>*/}
      <LoadableContent
        size={16}
        isLoading={isLoading}
        style={LoadStyles.CIRCLE}
      >
        {/*<TodoCount />*/}
      </LoadableContent>
    </div>
  );
}

function FellowshipTodoListImpl() {
  return (
    <FellowshipTodoProviders>
      <CollapsePanel labelItem={<Title />} defaultCollapsed={false}>
        <AlwaysVisible>
          <NavigationButtons />
        </AlwaysVisible>
        <TodoList />
      </CollapsePanel>
    </FellowshipTodoProviders>
  );
}

export default function FellowshipTodoList() {
  return (
    <CollectivesProvider section="fellowship">
      <FellowshipTodoListImpl />
    </CollectivesProvider>
  );
}

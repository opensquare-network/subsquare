import { CollectivesApiProvider } from "next-common/context/collectives/api";
import CollapsePanel, { AlwaysVisible } from "../collapsePanel";
import EvidenceTodo from "./evidenceTodo";
import NavigationButtons from "./navigationButtons";

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

export default function FellowshipTodoList() {
  return (
    <CollectivesApiProvider>
      <CollapsePanel labelItem={<Title />}>
        <AlwaysVisible>
          <NavigationButtons />
        </AlwaysVisible>
        <TodoList>
          <EvidenceTodo />
        </TodoList>
      </CollapsePanel>
    </CollectivesApiProvider>
  );
}

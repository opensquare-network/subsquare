import dynamic from "next/dynamic";
import CollapsePanel, { AlwaysVisible } from "../collapsePanel";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import NavigationButtons from "../fellowshipTodoList/navigationButtons";

const TodoList = dynamic(() => import("./todoList"), {
  ssr: false,
});

function Title() {
  return (
    <div className="flex items-center gap-1 text14Medium text-textTertiary">
      <span>Secretary To-do List</span>
    </div>
  );
}

function SecretaryTodoListImpl() {
  const address = useRealAddress();
  const { members, loading } = useFellowshipCollectiveMembers();
  const member = (members || []).find((item) =>
    isSameAddress(item.address, address),
  );

  if (loading || !member) {
    return null;
  }

  return (
    <CollapsePanel labelItem={<Title />} defaultCollapsed={false}>
      <AlwaysVisible>
        <NavigationButtons section="secretary" />
      </AlwaysVisible>
      <TodoList member={member} />
    </CollapsePanel>
  );
}

export default function SecretaryTodoList() {
  return (
    <CollectivesProvider section="secretary">
      <SecretaryTodoListImpl />
    </CollectivesProvider>
  );
}

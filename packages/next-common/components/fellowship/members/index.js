import { usePageProps } from "next-common/context/page";
import FellowshipMemberTable from "./table";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function FellowshipMembers({ members, isAllLoaded }) {
  const { fellowshipParams } = usePageProps();

  // TODO
  return (
    <CollectivesProvider section="fellowship" params={fellowshipParams ?? {}}>
      <FellowshipMemberTable members={members} isAllLoaded={isAllLoaded} />
    </CollectivesProvider>
  );
}

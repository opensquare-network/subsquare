import { usePageProps } from "next-common/context/page";
import CollectivesMemberTable from "next-common/components/collectives/members/table";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function FellowshipCollectiveMembers({ members }) {
  const { fellowshipParams } = usePageProps();

  return (
    <CollectivesProvider section="fellowship" params={fellowshipParams ?? {}}>
      <CollectivesMemberTable members={members} />
    </CollectivesProvider>
  );
}

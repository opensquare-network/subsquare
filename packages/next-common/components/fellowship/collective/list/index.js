import { usePageProps } from "next-common/context/page";
import CollectivesMemberTable from "next-common/components/collectives/members/table";

export default function FellowshipCollectiveMembers({ members }) {
  const { fellowshipParams } = usePageProps();

  return (
    <CollectivesMemberTable members={members} params={fellowshipParams ?? {}} />
  );
}

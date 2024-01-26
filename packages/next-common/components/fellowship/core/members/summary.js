import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import Summary from "next-common/components/summary/v2/base";
import { usePageProps } from "next-common/context/page";
import isNil from "lodash.isnil";
import LoadableContent from "next-common/components/common/loadableContent";

export default function FellowshipCoreMembersSummary() {
  const { fellowshipMembers } = usePageProps();
  const coreMembers = useSelector(fellowshipCoreMembersSelector);
  const candidates = (coreMembers || []).filter((m) => m.rank <= 0);
  const total = (coreMembers || []).length;

  const isLoading = isNil(coreMembers);

  const items = [
    {
      title: "Total",
      content: <LoadableContent isLoading={isLoading}>{total}</LoadableContent>,
    },
    {
      title: "Members",
      content: (
        <LoadableContent isLoading={isLoading}>
          {total - candidates.length}
        </LoadableContent>
      ),
    },
    {
      title: "Candidates",
      content: (
        <LoadableContent isLoading={isLoading}>
          {candidates.length}
        </LoadableContent>
      ),
    },
    {
      title: "Not Inducted",
      content: (
        <LoadableContent isLoading={isLoading}>
          {fellowshipMembers.length - total}
        </LoadableContent>
      ),
    },
  ];

  return <Summary items={items} />;
}

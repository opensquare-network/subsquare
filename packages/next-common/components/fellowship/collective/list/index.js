import { usePageProps } from "next-common/context/page";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import CollectivesMemberTable from "next-common/components/collectives/members/table";
import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";

export default function FellowshipCollectiveMembers({ members }) {
  const { fellowshipParams } = usePageProps();
  const salaryAsset = useSalaryAsset();
  const coreMembers = useSelector(fellowshipCoreMembersSelector);

  return (
    <CollectivesMemberTable
      members={members}
      params={fellowshipParams ?? {}}
      salaryAsset={salaryAsset}
      coreMembers={coreMembers}
    />
  );
}

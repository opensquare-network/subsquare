import { usePageProps } from "next-common/context/page";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import CollectivesMemberTable from "next-common/components/collectives/members/table";

export default function FellowshipCollectiveMembers({ members }) {
  const { fellowshipParams } = usePageProps();
  const salaryAsset = useSalaryAsset();

  return (
    <CollectivesMemberTable
      members={members}
      params={fellowshipParams ?? {}}
      salaryAsset={salaryAsset}
    />
  );
}

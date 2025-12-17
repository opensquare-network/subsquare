import { MapDataList } from "next-common/components/dataList";
import { usePageProps } from "next-common/context/page";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useTableViewColumnsDef from "../hooks/useTableViewColumnsDef";
import { useMemo } from "react";
// import ListTitleBar from "next-common/components/listTitleBar";

export default function TreasuryProjectsTableView() {
  const { projects = [] } = usePageProps();
  const columnsDef = useTableViewColumnsDef();

  const sortedProjects = useMemo(() => {
    return projects.sort((a, b) => b.fiatAtFinal - a.fiatAtFinal);
  }, [projects]);

  return (
    <div className="flex flex-col gap-y-4">
      {/* <ListTitleBar title="List" titleCount={projects.length} /> */}
      <SecondaryCard>
        <MapDataList data={sortedProjects} columnsDef={columnsDef} />
      </SecondaryCard>
    </div>
  );
}

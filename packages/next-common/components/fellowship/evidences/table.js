import DataList from "next-common/components/dataList";
import { isNil } from "lodash-es";
import fellowshipMemberColumns from "./columns";
import { getFellowshipEvidencesRows } from "./rows";

export default function FellowshipEvidencesTable({ evidences = [] }) {
  const isLoading = isNil(evidences);

  const filteredEvidences = evidences.filter(
    (evidence) => !isNil(evidence.rank),
  );

  const rows = getFellowshipEvidencesRows(filteredEvidences);

  return (
    <DataList
      bordered
      columns={fellowshipMemberColumns}
      noDataText="No Evidences"
      rows={rows}
      loading={isLoading}
    />
  );
}

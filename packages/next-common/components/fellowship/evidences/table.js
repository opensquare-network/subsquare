import DataList from "next-common/components/dataList";
import { isNil } from "lodash-es";
import fellowshipMemberColumns from "./columns";
import { useEvidencesRows } from "./useEvidenceRows";

export default function FellowshipEvidencesTable({ evidences = [] }) {
  const isLoading = isNil(evidences);

  const rows = useEvidencesRows(evidences);

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

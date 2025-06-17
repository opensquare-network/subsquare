import useQueryVoteActions from "../useQueryVoteActions";
import { useOnchainData } from "next-common/context/post";
import { columns } from "./columns";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";

export default function VoteActionsTable() {
  const { referendumIndex } = useOnchainData();
  const { loading, voteActions } = useQueryVoteActions(referendumIndex);

  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columns}
        data={voteActions}
        loading={loading}
        noDataText="No data"
      />
    </ScrollerX>
  );
}

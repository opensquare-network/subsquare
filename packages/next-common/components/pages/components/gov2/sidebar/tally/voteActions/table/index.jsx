import useQueryVoteActions from "../useQueryVoteActions";
import { useOnchainData } from "next-common/context/post";
import { desktopColumns, mobileColumns } from "./columns";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { cn } from "next-common/utils";

export default function VoteActionsTable() {
  const { referendumIndex } = useOnchainData();
  const { loading, voteActions } = useQueryVoteActions(referendumIndex);

  return (
    <>
      <ScrollerX>
        <MapDataList
          className="max-md:hidden"
          columnsDef={desktopColumns}
          data={voteActions}
          loading={loading}
          noDataText="No data"
          contentClassName="!max-h-max"
        />
        <MapDataList
          className={cn(
            "hidden max-md:block",
            "[&_.datalist_.descriptions-item-label]:hidden",
            "[&_.datalist_.descriptions-item-value]:w-full",
          )}
          columnsDef={mobileColumns}
          data={voteActions}
          loading={loading}
          noDataText="No data"
        />
      </ScrollerX>
    </>
  );
}

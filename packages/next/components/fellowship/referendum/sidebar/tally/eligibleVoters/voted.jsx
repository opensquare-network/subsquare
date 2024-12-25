import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import ListTable from "./listTable";
import columns from "./columns";
import { useSelector } from "react-redux";
import {
  fellowshipVotesSelector,
  isLoadingFellowshipVotesSelector,
} from "next-common/store/reducers/fellowship/votes";

export default function Voted() {
  const { allAye, allNay } = useSelector(fellowshipVotesSelector);
  const isLoadingVotes = useSelector(isLoadingFellowshipVotesSelector);
  const votedRows = [...allAye, ...allNay]?.map((item) => {
    return {
      address: item?.address,
      isAye: item?.isAye,
      votes: item?.votes,
      className: item?.isAye ? "bg-green100" : "bg-red100",
    };
  });

  const total = votedRows.length;

  return (
    <div>
      <TitleContainer className="text14Bold px-0 pb-3">
        <span>
          Voted
          <span className="text-textTertiary text14Medium ml-1">
            {!isLoadingVotes && total}
          </span>
        </span>
      </TitleContainer>

      <ListTable
        rows={votedRows}
        columns={columns}
        loading={isLoadingVotes}
        noDataText="No voter vote yet"
      />

      <Divider className="my-4" />
    </div>
  );
}

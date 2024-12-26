import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ListTable from "./listTable";
import columns from "./columns";

export default function UnVoted({ unVotedMembers, isLoading }) {
  const votedRows = unVotedMembers?.map((item) => {
    return {
      address: item?.address,
      votes: item?.votes,
      className: "bg-neutral200",
    };
  });

  const total = votedRows.length;

  return (
    <div>
      <TitleContainer className="text14Bold px-0 pb-3">
        <span>
          Un-voted
          <span className="text-textTertiary text14Medium ml-1">
            {!isLoading && total}
          </span>
        </span>
      </TitleContainer>

      <ListTable
        rows={votedRows}
        columns={columns}
        loading={isLoading}
        noDataText="All the voters have voted"
      />
    </div>
  );
}

import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import ListTable from "./listTable";
import columns from "./columns";

export default function Voted({ votedMembers, isLoading }) {
  const votedRows = votedMembers?.map((item) => {
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
            {!isLoading && total}
          </span>
        </span>
      </TitleContainer>

      <ListTable
        rows={votedRows}
        columns={columns}
        loading={isLoading}
        noDataText="No voter vote yet"
      />

      <Divider className="my-4" />
    </div>
  );
}

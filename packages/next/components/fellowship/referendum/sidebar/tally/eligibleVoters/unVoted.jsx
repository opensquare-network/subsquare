import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ListTable from "./listTable";
import columns from "./columns";

// mock data
export const rows = [
  {
    rank: 1,
    address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
    aye: null,
    votes: 1,
    className: "bg-neutral200",
  },
  {
    rank: 6,
    address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
    aye: null,
    votes: 6,
    className: "bg-neutral200",
  },
  {
    rank: 2,
    address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
    aye: null,
    votes: 2,
    className: "bg-neutral200",
  },
  {
    rank: 5,
    address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
    aye: null,
    votes: 5,
    className: "bg-neutral200",
  },
];

export default function UnVoted() {
  const loading = false;
  const total = rows.length;

  return (
    <div>
      <TitleContainer className="text14Bold px-0 pb-3">
        <span>
          Un-voted
          <span className="text-textTertiary text14Medium ml-1">
            {!loading && total}
          </span>
        </span>
      </TitleContainer>

      <ListTable
        rows={rows}
        columns={columns}
        loading={loading}
        noDataText="All the voters have voted"
      />
    </div>
  );
}

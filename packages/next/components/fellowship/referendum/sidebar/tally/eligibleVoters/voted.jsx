import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import ListTable from "./listTable";
import columns from "./columns";

// mock data
export const rows = [
  {
    rank: 1,
    address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
    aye: 1,
    votes: 1,
    className: "bg-green100",
  },
  {
    rank: 7,
    address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
    aye: 0,
    votes: 7,
    className: "bg-red100",
  },
  {
    rank: 2,
    address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
    aye: 1,
    votes: 2,
    className: "bg-green100",
  },
];

export default function Voted() {
  const loading = false;
  const total = rows.length;

  return (
    <div>
      <TitleContainer className="text14Bold px-0 pb-3">
        <span>
          Voted
          <span className="text-textTertiary text14Medium ml-1">
            {!loading && total}
          </span>
        </span>
      </TitleContainer>

      <ListTable
        rows={rows}
        columns={columns}
        loading={loading}
        noDataText="No voter vote yet"
      />

      <Divider className="my-4" />
    </div>
  );
}

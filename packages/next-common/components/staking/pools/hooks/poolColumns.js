import PoolsTag from "next-common/components/tags/state/pools";
import CellActions from "../columns/actions";
import { EmptyGuard, TotalBondedColumn, RolesColumn } from "../columns";
import PoolNameColumn from "../columns/poolName";

export const poolColumns = [
  {
    key: "poolId",
    name: "Pool ID",
    className: "flex-1",
    render: (data) => <PoolNameColumn poolId={data.poolId} />,
  },
  {
    key: "totalBonded",
    name: "Total Bonded",
    className: "text-right",
    width: 120,
    sortable: "desc,asc",
    render: (data) => (
      <EmptyGuard value={data.points}>
        <TotalBondedColumn value={data.points} />
      </EmptyGuard>
    ),
  },
  {
    key: "Nominees",
    name: "Nominees",
    className: "text-right",
    width: 120,
    render: (data) => (
      <EmptyGuard value={data.roles}>
        <RolesColumn value={data} />
      </EmptyGuard>
    ),
  },
  {
    key: "members",
    name: "Members",
    className: "text-right",
    width: 120,
    sortable: "desc,asc",
    render: (data) => (
      <EmptyGuard value={data.memberCounter}>{data.memberCounter}</EmptyGuard>
    ),
  },
  {
    key: "status",
    name: "Status",
    className: "text-right",
    width: 120,
    render: (data) => (
      <EmptyGuard value={data.state}>
        <PoolsTag state={data.state} />
      </EmptyGuard>
    ),
  },
  {
    key: "actions",
    name: "",
    className: "text-right",
    width: 60,
    render: (data) => <CellActions value={data} />,
  },
];

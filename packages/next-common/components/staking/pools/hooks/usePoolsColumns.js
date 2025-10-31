import { useMemo } from "react";
import PoolsTag from "next-common/components/tags/state/pools";
import CellActions from "../columns/actions";
import {
  MaybePoolNameOrRoles,
  EmptyGuard,
  TotalBondedColumn,
} from "../columns";
import useMyPool from "./useMyPool";

export default function usePoolsColumns() {
  const { result: myPool, loading: myPoolLoading } = useMyPool();

  return useMemo(() => {
    return [
      {
        key: "poolId",
        name: "Pool ID",
        className: "flex-1",
        render: (data) => <MaybePoolNameOrRoles value={data} />,
      },
      {
        key: "totalBonded",
        name: "Total Bonded",
        className: "text-right",
        width: 120,
        render: (data) => (
          <EmptyGuard value={data.points}>
            <TotalBondedColumn value={data.points} />
          </EmptyGuard>
        ),
      },
      {
        key: "members",
        name: "Members",
        className: "text-right",
        width: 120,
        render: (data) => (
          <EmptyGuard value={data.memberCounter}>
            {data.memberCounter}
          </EmptyGuard>
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
        render: (data) => (
          <CellActions
            myPool={myPool}
            myPoolLoading={myPoolLoading}
            value={data}
          />
        ),
      },
    ];
  }, [myPool, myPoolLoading]);
}

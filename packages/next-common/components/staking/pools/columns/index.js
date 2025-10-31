import ValueDisplay from "next-common/components/valueDisplay";
import PoolsTag from "next-common/components/tags/state/pools";
import { useChainSettings } from "next-common/context/chain";
import PoolNameColumn from "./poolName";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";
import { AddressUser } from "next-common/components/user";
import CellActions from "./actions";

const columns = [
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

export default columns;

function EmptyGuard({ value, children }) {
  if (isNil(value)) {
    return null;
  }
  return children;
}

function TotalBondedColumn({ value }) {
  const { symbol, decimals } = useChainSettings();
  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

function MaybePoolNameOrRoles({ value }) {
  if (isNil(value)) {
    return null;
  }

  if (value.poolId) {
    return <PoolNameColumn poolId={value.poolId} />;
  }

  return <RolesColumn value={value} />;
}

function RolesColumn({ value = {} }) {
  const addresses = Object.entries(value).filter(
    ([, address]) => !isNil(address),
  );

  return (
    <div>
      {addresses.map(([role, address]) => (
        <div key={`${role}-${address}`} className="flex items-center gap-x-2">
          <span className="text14Medium text-textTertiary w-[68px]">
            {role}
          </span>
          <AddressUser add={address} />
        </div>
      ))}
    </div>
  );
}

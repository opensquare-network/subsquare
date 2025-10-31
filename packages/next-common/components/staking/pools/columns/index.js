import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import PoolName from "./poolName";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";
import { AddressUser } from "next-common/components/user";

export function EmptyGuard({ value, children }) {
  if (isNil(value)) {
    return null;
  }
  return children;
}

export function TotalBondedColumn({ value }) {
  const { symbol, decimals } = useChainSettings();
  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

export function MaybePoolNameOrRoles({ value }) {
  if (isNil(value)) {
    return null;
  }

  if (value.poolId) {
    return <PoolName poolId={value.poolId} />;
  }

  return <RolesColumn value={value} />;
}

export function RolesColumn({ value = {} }) {
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

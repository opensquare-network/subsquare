import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import PoolName from "./poolName";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";
import { AddressUser } from "next-common/components/user";
import Tooltip from "next-common/components/tooltip";
import { useMemo } from "react";

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
  const roles = value?.roles?.[0] || {};
  const addresses = Object.entries(roles).filter(
    ([, address]) => !isNil(address),
  );

  const content = useMemo(() => {
    if (addresses.length === 0) {
      return null;
    }
    return (
      <div className="flex flex-col gap-y-1">
        {addresses.map(([role, address]) => (
          <div
            key={`${role}-${address}`}
            className="text12Medium text-white flex items-center"
          >
            <span className="w-[68px]">{role}</span>
            <AddressUser className="text12Medium text-white" add={address} />
          </div>
        ))}
      </div>
    );
  }, [addresses]);

  return <Tooltip content={content}>{addresses.length}</Tooltip>;
}

import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";
import CollapsePanel from "./collapsePanel";
import { useUserAccountInfo } from "next-common/context/user/account";
import useFiatPrice from "next-common/hooks/useFiatPrice";
import BigNumber from "bignumber.js";
import { abbreviateBigNumber } from "next-common/utils";

// TODO: style * responsive
function AccountBalanceFiatValue({ value }) {
  const { price, loading } = useFiatPrice();

  if (Number(value) === 0 || loading) {
    return null;
  }

  const fiatValue = BigNumber(value).multipliedBy(price);

  return (
    <div className="inline-flex text14Medium text-textTertiary whitespace-nowrap">
      {!!(value && price) && "≈"} ${abbreviateBigNumber(fiatValue)}
    </div>
  );
}

function AccountBalanceItem({ value, title, isLoading }) {
  return (
    <div className="inline-flex items-center w-full gap-4 col-span-2">
      <LoadableItem
        value={value}
        isLoading={isLoading}
        title={title}
        className={"inline-flex flex-row items-center justify-between"}
        titleClassName={"mb-0 text14Medium text-textTertiary flex-1 w-[90px]"}
        valueClassName="text14Medium"
      />
      <AccountBalanceFiatValue value={value} />
    </div>
  );
}

export function TotalBalance() {
  const { info, isLoading } = useUserAccountInfo();

  return (
    <AccountBalanceItem
      value={info?.data?.total}
      isLoading={isLoading}
      title={"Total Balance"}
    />
  );
}

export function Transferrable() {
  const { info, isLoading } = useUserAccountInfo();

  return (
    <AccountBalanceItem
      value={info?.data?.transferrable}
      isLoading={isLoading}
      title="Transferrable"
    />
  );
}

export function Reserved() {
  const { info, isLoading } = useUserAccountInfo();

  return (
    <AccountBalanceItem
      value={info?.data?.reserved}
      isLoading={isLoading}
      title="Reserved"
    />
  );
}

export function Locked() {
  const { info, isLoading } = useUserAccountInfo();

  return (
    <AccountBalanceItem
      value={info?.data?.lockedBalance}
      isLoading={isLoading}
      title="Locked"
    />
  );
}

export default function AccountBalances() {
  return (
    <CollapsePanel labelItem={<TotalBalance />} labelItemClassName="space-y-1">
      <Transferrable />
      <Reserved />
      <Locked />
    </CollapsePanel>
  );
}

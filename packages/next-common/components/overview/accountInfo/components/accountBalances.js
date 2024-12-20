import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";
import CollapsePanel from "./collapsePanel";
import { useUserAccountInfo } from "next-common/context/user/account";

function AccountBalanceItem({ value, title, isLoading }) {
  return (
    <div className="inline-flex items-center w-full gap-0">
      <LoadableItem
        value={value}
        isLoading={isLoading}
        title={title}
        className={"inline-flex flex-row items-center justify-between"}
        titleClassName={"mb-0 text14Medium text-textTertiary"}
        valueClassName="text14Medium"
      />
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
    <CollapsePanel labelItem={<TotalBalance />}>
      <Transferrable />
      <Reserved />
      <Locked />
    </CollapsePanel>
  );
}

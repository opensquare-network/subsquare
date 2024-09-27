import { useSelector } from "react-redux";
import {
  accountInfoSelector,
  accountLockedBalanceSelector,
  accountTotalBalanceSelector,
  accountTransferrableBalanceSelector,
  isLoadingAccountInfoSelector,
} from "next-common/store/reducers/myOnChainData/account";
import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";
import CollapsePanel from "./collapsePanel";

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
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const totalBalance = useSelector(accountTotalBalanceSelector);

  return (
    <AccountBalanceItem
      value={totalBalance}
      isLoading={isLoading}
      title={"Total Balance"}
    />
  );
}

export function Transferrable() {
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const transferrable = useSelector(accountTransferrableBalanceSelector);

  return (
    <AccountBalanceItem
      value={transferrable}
      isLoading={isLoading}
      title="Transferrable"
    />
  );
}

export function Reserved() {
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const accountInfo = useSelector(accountInfoSelector);

  return (
    <AccountBalanceItem
      value={accountInfo?.reserved}
      isLoading={isLoading}
      title="Reserved"
    />
  );
}

export function Locked() {
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const locked = useSelector(accountLockedBalanceSelector);

  return (
    <AccountBalanceItem value={locked} isLoading={isLoading} title="Locked" />
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

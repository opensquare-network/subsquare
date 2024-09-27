import { useSelector } from "react-redux";
import {
  accountInfoSelector,
  accountLockedBalanceSelector,
  accountTotalBalanceSelector,
  accountTransferrableBalanceSelector,
  isLoadingAccountInfoSelector,
} from "next-common/store/reducers/myOnChainData/account";
import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import CollapsePanel from "./collapsePanel";

export function TotalBalance() {
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const totalBalance = useSelector(accountTotalBalanceSelector);

  return (
    <SummaryItem title="Total Balance">
      <LoadableItem value={totalBalance} isLoading={isLoading} />
    </SummaryItem>
  );
}

export function Transferrable() {
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const transferrable = useSelector(accountTransferrableBalanceSelector);

  return (
    <SummaryItem title="Transferrable">
      <LoadableItem value={transferrable} isLoading={isLoading} />
    </SummaryItem>
  );
}

export function Reserved() {
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const accountInfo = useSelector(accountInfoSelector);

  return (
    <SummaryItem title="Reserved">
      <LoadableItem value={accountInfo?.reserved} isLoading={isLoading} />
    </SummaryItem>
  );
}

export function Locked() {
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const locked = useSelector(accountLockedBalanceSelector);

  return (
    <SummaryItem title="Locked">
      <LoadableItem value={locked} isLoading={isLoading} />
    </SummaryItem>
  );
}

export default function AccountBalances() {
  return (
    <SummaryLayout>
      <CollapsePanel>
        <TotalBalance />
        <Transferrable />
        <Reserved />
        <Locked />
      </CollapsePanel>
    </SummaryLayout>
  );
}

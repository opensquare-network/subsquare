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

export default function AccountBalances() {
  const accountInfo = useSelector(accountInfoSelector);
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const totalBalance = useSelector(accountTotalBalanceSelector);
  const transferrable = useSelector(accountTransferrableBalanceSelector);
  const locked = useSelector(accountLockedBalanceSelector);

  return (
    <SummaryLayout>
      <SummaryItem title="Total Balance">
        <LoadableItem value={totalBalance} isLoading={isLoading} />
      </SummaryItem>
      <SummaryItem title="Transferrable">
        <LoadableItem value={transferrable} isLoading={isLoading} />
      </SummaryItem>
      <SummaryItem title="Reserved">
        <LoadableItem value={accountInfo?.reserved} isLoading={isLoading} />
      </SummaryItem>
      <SummaryItem title="Locked">
        <LoadableItem value={locked} isLoading={isLoading} />
      </SummaryItem>
    </SummaryLayout>
  );
}

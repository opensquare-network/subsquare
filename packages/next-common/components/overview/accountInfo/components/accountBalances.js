import { useSelector } from "react-redux";
import {
  accountInfoSelector,
  accountLockedBalanceSelector,
  accountTotalBalanceSelector,
  accountTransferrableBalanceSelector,
  isLoadingAccountInfoSelector,
} from "next-common/store/reducers/myOnChainData/account";
import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";

export default function AccountBalances() {
  const accountInfo = useSelector(accountInfoSelector);
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const totalBalance = useSelector(accountTotalBalanceSelector);
  const transferrable = useSelector(accountTransferrableBalanceSelector);
  const locked = useSelector(accountLockedBalanceSelector);

  return (
    <div className="flex w-full max-md:flex-col max-md:gap-y-2">
      <LoadableItem
        title="Total Balance"
        value={totalBalance}
        isLoading={isLoading}
      />
      <LoadableItem
        title="Transferrable"
        value={transferrable}
        isLoading={isLoading}
      />
      <LoadableItem
        title="Reserved"
        value={accountInfo?.reserved}
        isLoading={isLoading}
      />
      <LoadableItem title="Locked" value={locked} isLoading={isLoading} />
    </div>
  );
}

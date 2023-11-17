import { useSelector } from "react-redux";
import {
  accountInfoSelector,
  accountLockedBalanceSelector,
  accountTotalBalanceSelector,
  accountTransferrableBalanceSelector,
  isLoadingAccountInfoSelector,
} from "next-common/store/reducers/myOnChainData/account";
import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";
import { cn } from "next-common/utils";

export default function AccountBalances() {
  const accountInfo = useSelector(accountInfoSelector);
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const totalBalance = useSelector(accountTotalBalanceSelector);
  const transferrable = useSelector(accountTransferrableBalanceSelector);
  const locked = useSelector(accountLockedBalanceSelector);

  return (
    <div
      className={cn(
        "w-full",
        "flex gap-x-4",
        "max-md:grid max-md:grid-cols-2 max-md:gap-y-4",
      )}
    >
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

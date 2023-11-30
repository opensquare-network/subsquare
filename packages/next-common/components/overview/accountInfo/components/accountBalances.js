import { useSelector } from "react-redux";
import {
  accountInfoSelector,
  accountLockedBalanceSelector,
  accountTotalBalanceSelector,
  accountTransferrableBalanceSelector,
  isLoadingAccountInfoSelector,
} from "next-common/store/reducers/myOnChainData/account";
import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";
import Summary from "next-common/components/summary/v2/base";

export default function AccountBalances() {
  const accountInfo = useSelector(accountInfoSelector);
  const isLoading = useSelector(isLoadingAccountInfoSelector);
  const totalBalance = useSelector(accountTotalBalanceSelector);
  const transferrable = useSelector(accountTransferrableBalanceSelector);
  const locked = useSelector(accountLockedBalanceSelector);

  const items = [
    {
      title: "Total Balance",
      content: <LoadableItem value={totalBalance} isLoading={isLoading} />,
    },
    {
      title: "Transferrable",
      content: <LoadableItem value={transferrable} isLoading={isLoading} />,
    },
    {
      title: "Reserved",
      content: (
        <LoadableItem value={accountInfo?.reserved} isLoading={isLoading} />
      ),
    },
    {
      title: "Locked",
      content: <LoadableItem value={locked} isLoading={isLoading} />,
    },
  ];

  return <Summary items={items} />;
}

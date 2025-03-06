import { AccountBalanceItem } from "next-common/components/overview/accountInfo/components/accountBalances";
import { useUserAccountInfo } from "next-common/context/user/account";

function CollapsePanel({ children }) {
  return <div className="w-[300px]">{children}</div>;
}

function TotalBalance() {
  const { info, isLoading } = useUserAccountInfo();

  return (
    <AccountBalanceItem
      value={info?.data?.total}
      isLoading={isLoading}
      title={"Total Balance"}
    />
  );
}

function Transferrable() {
  const { info, isLoading } = useUserAccountInfo();

  return (
    <AccountBalanceItem
      value={info?.data?.transferrable}
      isLoading={isLoading}
      title="Transferrable"
    />
  );
}

function Reserved() {
  const { info, isLoading } = useUserAccountInfo();

  return (
    <AccountBalanceItem
      value={info?.data?.reserved}
      isLoading={isLoading}
      title="Reserved"
    />
  );
}

function Locked() {
  const { info, isLoading } = useUserAccountInfo();

  return (
    <AccountBalanceItem
      value={info?.data?.lockedBalance}
      isLoading={isLoading}
      title="Locked"
    />
  );
}

export default function OpenGovAssetInfo() {
  return (
    <CollapsePanel>
      <TotalBalance />
      <Transferrable />
      <Reserved />
      <Locked />
    </CollapsePanel>
  );
}

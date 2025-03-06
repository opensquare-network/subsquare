import {
  AccountBalanceItem,
  useIsMobile,
} from "next-common/components/overview/accountInfo/components/accountBalances";
import { useUserAccountInfo } from "next-common/context/user/account";
import { cn } from "next-common/utils";
import CollapsePanel from "next-common/components/overview/accountInfo/components/collapsePanel";

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
  const isMobile = useIsMobile();

  return (
    <CollapsePanel
      className={cn(isMobile ? "w-full" : "w-[300px]")}
      btnClassName="mx-0"
      labelItem={<TotalBalance />}
    >
      <Transferrable />
      <Reserved />
      <Locked />
    </CollapsePanel>
  );
}

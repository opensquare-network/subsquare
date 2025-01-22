import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";
import CollapsePanel from "./collapsePanel";
import { useUserAccountInfo } from "next-common/context/user/account";
import useFiatPrice from "next-common/hooks/useFiatPrice";
import BigNumber from "bignumber.js";
import { abbreviateBigNumber } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

function AccountBalanceFiatValue({ value, className }) {
  const { price, loading } = useFiatPrice();
  const fiatValue = BigNumber(value).multipliedBy(price);
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "min-w-[100px] text14Medium text-textTertiary whitespace-nowrap",
        navCollapsed
          ? "max-sm:w-full max-sm:justify-end max-sm:text12Medium"
          : "max-md:w-full max-md:justify-end max-md:text12Medium",
        className,
      )}
    >
      {Number(value) === 0 || loading
        ? ""
        : `${!!(value && price) && "≈"} ${abbreviateBigNumber(fiatValue)}`}
    </div>
  );
}

function AccountBalanceItem({ value, title, isLoading }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <>
      <div className="inline-flex items-center w-full gap-4">
        <LoadableItem
          value={value}
          isLoading={isLoading}
          title={title}
          className={"inline-flex flex-row items-center justify-between"}
          titleClassName={
            "mb-0 text14Medium text-textTertiary flex-1 min-w-[90px]"
          }
          valueClassName="text14Medium min-w-[100px] ml-5 inline-flex justify-end"
        />
        <AccountBalanceFiatValue
          value={value}
          className={cn(
            "inline-flex",
            navCollapsed ? "max-sm:hidden" : "max-md:hidden",
          )}
        />
      </div>
      <AccountBalanceFiatValue
        value={value}
        className={cn(
          "hidden",
          navCollapsed ? "max-sm:inline-flex" : "max-md:inline-flex",
        )}
      />
    </>
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

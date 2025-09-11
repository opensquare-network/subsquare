import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";
import CollapsePanel from "./collapsePanel";
import { useUserAccountInfo } from "next-common/context/user/account";
import { useFiatPriceSnapshot } from "next-common/hooks/useFiatPrice";
import BigNumber from "bignumber.js";
import { abbreviateBigNumber } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import WindowSizeProvider, {
  useWindowWidthContext,
} from "next-common/context/windowSize";
import { useChainSettings } from "next-common/context/chain";

export function useIsMobile() {
  const [navCollapsed] = useNavCollapsed();
  const width = useWindowWidthContext();

  return (navCollapsed && width < 768) || (!navCollapsed && width < 1024);
}

export function AccountBalanceFiatValue({ value, className }) {
  const { price, loading } = useFiatPriceSnapshot();
  const { decimals } = useChainSettings();
  const isMobile = useIsMobile();

  const fiatValue = BigNumber(value)
    .dividedBy(Math.pow(10, decimals))
    .multipliedBy(price);

  const isShowValue = !loading && !isNaN(fiatValue) && value != 0;

  if (isMobile && !isShowValue) {
    return null;
  }

  return (
    <div
      className={cn(
        "min-w-[100px] text14Medium text-textTertiary whitespace-nowrap",
        isMobile && "w-full justify-end text12Medium",
        className,
      )}
    >
      {isShowValue && `≈ $${abbreviateBigNumber(fiatValue)}`}
    </div>
  );
}

export function AccountBalanceItem({ value, title, isLoading, className }) {
  const isMobile = useIsMobile();

  if (!isLoading && isNaN(value)) {
    return null;
  }

  return (
    <div
      className={cn(
        "group",
        "[&:not(:last-child)]:mb-1",
        "flex items-center",
        isMobile && "w-full inline-flex flex-col",
        className,
      )}
    >
      <div className="inline-flex items-center w-full gap-4">
        <LoadableItem
          value={value}
          isLoading={isLoading}
          title={title}
          className={"inline-flex flex-row items-center justify-between"}
          titleClassName={"mb-0 text14Medium text-textTertiary flex-1 w-[90px]"}
          valueClassName="text14Medium min-w-[100px] ml-5 inline-flex justify-end"
        />
        <AccountBalanceFiatValue
          value={value}
          className={cn("inline-flex", isMobile && "hidden")}
        />
      </div>
      <AccountBalanceFiatValue
        value={value}
        className={cn("hidden", isMobile && "inline-flex")}
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
    <WindowSizeProvider>
      <CollapsePanel className="w-[300px]" labelItem={<TotalBalance />}>
        <Transferrable />
        <Reserved />
        <Locked />
      </CollapsePanel>
    </WindowSizeProvider>
  );
}

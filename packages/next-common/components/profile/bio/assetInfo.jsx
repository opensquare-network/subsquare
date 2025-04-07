import { AccountBalanceFiatValue } from "next-common/components/overview/accountInfo/components/accountBalances";
import { useUserAccountInfo } from "next-common/context/user/account";
import { useState } from "react";
import { ArrowUp, ArrowDown } from "@osn/icons/subsquare";
import CommonPanel from "./commonPanel";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

function TotalBalance({ symbol, decimals }) {
  const { info } = useUserAccountInfo();
  const value = info?.data?.total || 0;

  return (
    <div className="flex flex-col justify-center items-center w-full gap-1">
      <span className="text12Medium text-textTertiary">Total Balance</span>
      <ValueDisplay
        value={toPrecision(value, decimals)}
        symbol={symbol}
        className="text16Bold"
      />
      <AccountBalanceFiatValue
        value={value}
        className="inline-flex justify-center items-center text12Medium"
      />
    </div>
  );
}

function Transferrable({ symbol, decimals }) {
  const { info } = useUserAccountInfo();

  return (
    <ValueDisplay
      value={toPrecision(info?.data?.transferrable || 0, decimals)}
      symbol={symbol}
      className="text12Medium"
    />
  );
}

function Reserved({ symbol, decimals }) {
  const { info } = useUserAccountInfo();

  return (
    <ValueDisplay
      value={toPrecision(info?.data?.reserved || 0, decimals)}
      symbol={symbol}
      className="text12Medium"
    />
  );
}

function Locked({ symbol, decimals }) {
  const { info } = useUserAccountInfo();

  return (
    <ValueDisplay
      value={toPrecision(info?.data?.lockedBalance || 0, decimals)}
      symbol={symbol}
      className="text12Medium"
    />
  );
}

function ValueItem({ children, title }) {
  return (
    <div className="w-full inline-flex justify-between items-center">
      <span className="text12Medium text-textTertiary">{title}</span>
      {children}
    </div>
  );
}

function ValueWrapper({ children }) {
  return (
    <GreyPanel className="flex flex-col bg-neutral200 py-1.5 px-3 justify-between items-center w-full gap-1">
      {children}
    </GreyPanel>
  );
}

export default function CommonAssetInfo({ address }) {
  const { symbol, decimals } = useChainSettings();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const Icon = isCollapsed ? ArrowUp : ArrowDown;

  if (!address) {
    return null;
  }

  return (
    <CommonPanel className="relative">
      <div
        role="button"
        className="absolute right-3 top-3 w-7 h-7 flex items-center justify-center shrink-0 border border-neutral400 rounded-[8px] cursor-pointer bg-neutral100"
        onClick={toggleCollapse}
      >
        <Icon className="w-5 h-5 [&_path]:stroke-textPrimary" />
      </div>
      <div className="flex flex-1 flex-col items-center gap-y-1">
        <TotalBalance symbol={symbol} decimals={decimals} />
      </div>
      <div className="flex w-full space-y-1">
        <ValueWrapper>
          <ValueItem title="Transferable">
            <Transferrable symbol={symbol} decimals={decimals} />
          </ValueItem>
          {isCollapsed && (
            <>
              <ValueItem title="Reserved">
                <Reserved symbol={symbol} decimals={decimals} />
              </ValueItem>
              <ValueItem title="Locked">
                <Locked symbol={symbol} decimals={decimals} />
              </ValueItem>
            </>
          )}
        </ValueWrapper>
      </div>
    </CommonPanel>
  );
}

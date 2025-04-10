import { AccountBalanceFiatValue } from "next-common/components/overview/accountInfo/components/accountBalances";
import { useUserAccountInfo } from "next-common/context/user/account";
import { useState } from "react";
import { ArrowUp, ArrowDown } from "@osn/icons/subsquare";
import CommonPanel from "./commonPanel";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import useKintAccountInfo from "next-common/hooks/useKintAccountInfo";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import FieldLoading from "next-common/components/icons/fieldLoading";

function TotalBalance({ info, isLoading }) {
  const value = info?.data?.total || 0;
  const { symbol, decimals } = useChainSettings();

  return (
    <div className="flex flex-col justify-center items-center w-full gap-1">
      <span className="text12Medium text-textTertiary">Total Balance</span>
      {isLoading ? (
        <FieldLoading />
      ) : (
        <ValueDisplay
          value={toPrecision(value, decimals)}
          symbol={symbol}
          className="text16Bold"
        />
      )}
      <AccountBalanceFiatValue
        value={value}
        className="inline-flex justify-center items-center text12Medium"
      />
    </div>
  );
}

function ValueWrapper({ children }) {
  return (
    <GreyPanel className="flex flex-col bg-neutral200 py-1.5 px-3 justify-between items-center w-full gap-1 rounded-[4px]">
      {children}
    </GreyPanel>
  );
}

function AssetItem({ value, title, isLoading }) {
  const { symbol, decimals } = useChainSettings();

  return (
    <div className="w-full inline-flex justify-between items-center h-4">
      <span className="text12Medium text-textTertiary">
        {isLoading ? <FieldLoading size={16} /> : title}
      </span>
      {isLoading ? (
        <FieldLoading size={16} />
      ) : (
        <ValueDisplay
          value={toPrecision(value || 0, decimals)}
          symbol={symbol}
          className="text12Medium"
        />
      )}
    </div>
  );
}

const isEmpty = (value) => !value || new BigNumber(value).isZero();

function CommonAssetInfo({ address, isLoading = false, info }) {
  const { symbol, decimals } = useChainSettings();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const Icon = isCollapsed ? ArrowUp : ArrowDown;

  const showTransferrable = !isNil(info?.data?.transferrable);
  const showBonded = !isEmpty(info?.data?.bonded);
  const showLocked = !isEmpty(info?.data?.lockedBalance);

  if (!address) {
    return null;
  }

  return (
    <CommonPanel
      className="relative"
      onExtraBtnClick={toggleCollapse}
      extra={<Icon className="w-5 h-5 [&_path]:stroke-textPrimary" />}
    >
      <div className="flex flex-1 flex-col items-center gap-y-1">
        <TotalBalance
          symbol={symbol}
          decimals={decimals}
          info={info}
          isLoading={isLoading}
        />
      </div>
      <div className="flex w-full space-y-1">
        <ValueWrapper>
          {showTransferrable ? (
            <AssetItem
              value={info?.data?.transferrable}
              title="Transferrable"
              isLoading={isLoading}
            />
          ) : (
            <AssetItem
              value={info?.data?.free}
              title="Free"
              isLoading={isLoading}
            />
          )}

          {isCollapsed && (
            <>
              {showBonded && (
                <AssetItem
                  value={info?.data?.bonded}
                  title="Bonded"
                  isLoading={isLoading}
                />
              )}
              <AssetItem
                value={info?.data?.reserved}
                title="Reserved"
                isLoading={isLoading}
              />

              {showLocked && (
                <AssetItem
                  value={info?.data?.lockedBalance}
                  title="Locked"
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </ValueWrapper>
      </div>
    </CommonPanel>
  );
}

export default function AssetInfo({ address }) {
  const { info, isLoading } = useUserAccountInfo();

  return (
    <CommonAssetInfo address={address} isLoading={isLoading} info={info} />
  );
}

export function KintAssetInfo({ address }) {
  const info = useKintAccountInfo(address);

  if (!info) {
    return null;
  }

  return <CommonAssetInfo address={address} info={info} />;
}

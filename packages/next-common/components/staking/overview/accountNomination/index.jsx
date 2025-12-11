import { isNil } from "lodash-es";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";
import { useValidatorsWithStatus } from "next-common/hooks/staking/useValidatorWithStatus";
import { cn } from "next-common/utils";
import LoadableContent from "next-common/components/common/loadableContent";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import NominatorQuickActions from "./quickActions";
import Divider from "next-common/components/styled/layout/divider";
import WindowSizeProvider from "next-common/context/windowSize";
import CollapsePanel from "next-common/components/overview/accountInfo/components/collapsePanel";
import { AccountBalanceItem } from "next-common/components/overview/accountInfo/components/accountBalances";
import useStakingBalance from "./useStakingBalance";
import WithdrawUnbondedButton from "./withdrawUnbondedButton";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { AddressUser } from "next-common/components/user";

const StartNominatingPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountNomination/startNominatingPopup"
  ),
);

export function NominatorStatus({ title, nominator, nominees }) {
  const { active, loading } = useValidatorsWithStatus(
    nominator,
    nominees || [],
  );

  let message = null;
  if (!nominees.length) {
    message = "Inactive: No Nominations Set";
  } else if (!active?.length) {
    message = "Waiting for Active Nominations";
  } else {
    message = (
      <div className="flex items-center gap-2">
        <span>Nominating and Earning Rewards</span>
        <Tooltip
          content={
            <div className="flex gap-2 text-textPrimaryContrast text12Medium">
              <span>Elected by</span>
              {(active || []).map((validator) => (
                <AddressUser
                  className="text-textPrimaryContrast text12Medium"
                  key={validator}
                  add={validator}
                />
              ))}
            </div>
          }
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="text12Medium text-textTertiary">
        {title || "Nominator Status"}
      </div>
      <div className="text14Medium text-textPrimary">
        <LoadableContent isLoading={loading} size={14}>
          {message}
        </LoadableContent>
      </div>
    </div>
  );
}

function Header({ width }) {
  const realAddress = useRealAddress();
  const { nominators } = useMyStakingLedger();

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex justify-between items-start grow gap-4",
          width > 768 ? "flex-row" : "flex-col",
        )}
      >
        <NominatorStatus
          nominees={nominators?.targets || []}
          nominator={realAddress}
        />
        <div className="flex gap-[16px] items-center">
          <NominatorQuickActions />
        </div>
      </div>
    </div>
  );
}

function StakingBalance() {
  const { loading, total, active, unlocking, unlocked } = useStakingBalance();

  return (
    <div className="flex flex-col gap-2">
      <WindowSizeProvider>
        <CollapsePanel
          className="w-[300px] [&>*:not(:last-child)]:mb-1"
          labelItem={
            <AccountBalanceItem
              title="In nominating"
              value={total?.toString() || 0}
              isLoading={loading}
            />
          }
        >
          <AccountBalanceItem
            title="Active"
            value={active?.toString() || 0}
            isLoading={loading}
          />
          <AccountBalanceItem
            title="Unbonding"
            value={unlocking?.toString() || 0}
            isLoading={loading}
          />
          <div className="flex items-center gap-2 max-sm:items-end max-sm:gap-0 max-sm:flex-col">
            <AccountBalanceItem
              title="Unbonded"
              value={unlocked?.toString() || 0}
              isLoading={loading}
            />
            {unlocked > 0n && <WithdrawUnbondedButton />}
          </div>
        </CollapsePanel>
      </WindowSizeProvider>
    </div>
  );
}

export default function AccountNomination() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return (
    <NeutralPanel className="p-6 space-y-4">
      <Header width={width} />
      <Divider />
      <StakingBalance />
    </NeutralPanel>
  );
}

export function AccountNominationEmpty() {
  const [showStartNominatingPopup, setShowStartNominatingPopup] =
    useState(false);

  return (
    <NeutralPanel className="p-6">
      <div className="text-center text14Medium text-textTertiary">
        You are not nominating any validators.{" "}
        <div
          role="button"
          className="cursor-pointer text-theme500 hover:underline"
          onClick={() => setShowStartNominatingPopup(true)}
        >
          Start Nominating
        </div>
      </div>
      {showStartNominatingPopup && (
        <StartNominatingPopup
          onClose={() => setShowStartNominatingPopup(false)}
        />
      )}
    </NeutralPanel>
  );
}

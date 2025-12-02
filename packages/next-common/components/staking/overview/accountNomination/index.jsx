import { isNil } from "lodash-es";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";
import { CurrentEraStakersProvider } from "next-common/context/staking/currentEraStakers";
import { useValidatorsWithStatus } from "next-common/hooks/staking/useValidatorWithStatus";
import { cn } from "next-common/utils";
import LoadableContent from "next-common/components/common/loadableContent";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const StartNominatingPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountNomination/startNominatingPopup"
  ),
);

function AccountNominationImpl() {
  const { width } = useWindowSize();
  const { nominators } = useMyStakingLedger();
  const { active, loading } = useValidatorsWithStatus(
    nominators?.targets || [],
  );

  if (isNil(width)) {
    return null;
  }

  let message = null;
  if (!nominators?.targets.length) {
    message = "Inactive: No Nominations Set";
  } else if (!active?.length) {
    message = "Waiting for Active Nominations";
  } else {
    message = "Nominating and Earning Rewards";
  }

  return (
    <NeutralPanel className="p-6 space-y-4">
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            "flex justify-between items-start grow gap-4",
            width > 768 ? "flex-row" : "flex-col",
          )}
        >
          <div className="flex flex-col gap-1">
            <div className="text12Medium text-textTertiary">
              Nominator Status
            </div>
            <div className="text14Medium text-textPrimary">
              <LoadableContent isLoading={loading} size={14}>
                {message}
              </LoadableContent>
            </div>
          </div>
          <div className="flex gap-[16px] items-center"></div>
        </div>
      </div>
    </NeutralPanel>
  );
}

function AccountNominationEmpty() {
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

export default function AccountNomination() {
  const { nominators, loading } = useMyStakingLedger();

  if (loading) {
    return null;
  }

  if (isNil(nominators)) {
    return <AccountNominationEmpty />;
  }

  return (
    <CurrentEraStakersProvider>
      <AccountNominationImpl />
    </CurrentEraStakersProvider>
  );
}

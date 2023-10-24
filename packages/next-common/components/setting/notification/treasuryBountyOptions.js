import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";

export default function TreasuryBountyOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();

  const [treasuryBountyProposed, setTreasuryBountyProposed] = useState(
    !!subscription.treasuryBountyProposed?.isOn,
  );
  const [treasuryBountyAwarded, setTreasuryBountyAwarded] = useState(
    !!subscription.treasuryBountyAwarded?.isOn,
  );
  const [treasuryBountyApproved, setTreasuryBountyApproved] = useState(
    !!subscription.treasuryBountyApproved?.isOn,
  );
  const [treasuryBountyCanceled, setTreasuryBountyCanceled] = useState(
    !!subscription.treasuryBountyCanceled?.isOn,
  );
  const [treasuryBountyClaimed, setTreasuryBountyClaimed] = useState(
    !!subscription.treasuryBountyClaimed?.isOn,
  );
  const [treasuryBountyRejected, setTreasuryBountyRejected] = useState(
    !!subscription.treasuryBountyRejected?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    treasuryBountyProposed,
    treasuryBountyAwarded,
    treasuryBountyApproved,
    treasuryBountyCanceled,
    treasuryBountyClaimed,
    treasuryBountyRejected,
  });

  return (
    <div>
      <SubLabel>Bounties</SubLabel>
      <ToggleItem>
        <div>Bounties proposed or canceled</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryBountyProposed || treasuryBountyCanceled}
          onToggle={changeGuard((isOn) => {
            setTreasuryBountyProposed(isOn);
            setTreasuryBountyCanceled(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Bounties claimed or awarded</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryBountyClaimed || treasuryBountyAwarded}
          onToggle={changeGuard((isOn) => {
            setTreasuryBountyClaimed(isOn);
            setTreasuryBountyAwarded(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Bounties rejected or approved</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryBountyApproved || treasuryBountyRejected}
          onToggle={changeGuard((isOn) => {
            setTreasuryBountyApproved(isOn);
            setTreasuryBountyRejected(isOn);
          })}
        />
      </ToggleItem>
    </div>
  );
}

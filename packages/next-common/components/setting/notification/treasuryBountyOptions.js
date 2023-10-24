import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import { useDebounceAutoSaveOnChainOptions } from "./common";

export default function TreasuryBountyOptions({ disabled, ...data }) {
  const [treasuryBountyProposed, setTreasuryBountyProposed] = useState(
    !!data.treasuryBountyProposed?.isOn,
  );
  const [treasuryBountyAwarded, setTreasuryBountyAwarded] = useState(
    !!data.treasuryBountyAwarded?.isOn,
  );
  const [treasuryBountyApproved, setTreasuryBountyApproved] = useState(
    !!data.treasuryBountyApproved?.isOn,
  );
  const [treasuryBountyCanceled, setTreasuryBountyCanceled] = useState(
    !!data.treasuryBountyCanceled?.isOn,
  );
  const [treasuryBountyClaimed, setTreasuryBountyClaimed] = useState(
    !!data.treasuryBountyClaimed?.isOn,
  );
  const [treasuryBountyRejected, setTreasuryBountyRejected] = useState(
    !!data.treasuryBountyRejected?.isOn,
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

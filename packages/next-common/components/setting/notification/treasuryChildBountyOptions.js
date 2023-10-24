import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import { useDebounceAutoSaveOnChainOptions } from "./common";

export default function TreasuryChildBountyOptions({ disabled, ...data }) {
  const [treasuryChildBountyAdded, setTreasuryChildBountyAdded] = useState(
    !!data.treasuryChildBountyAdded?.isOn,
  );
  const [treasuryChildBountyAwarded, setTreasuryChildBountyAwarded] = useState(
    !!data.treasuryChildBountyAwarded?.isOn,
  );
  const [treasuryChildBountyCanceled, setTreasuryChildBountyCanceled] =
    useState(!!data.treasuryChildBountyCanceled?.isOn);
  const [treasuryChildBountyClaimed, setTreasuryChildBountyClaimed] = useState(
    !!data.treasuryChildBountyClaimed?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    treasuryChildBountyAdded,
    treasuryChildBountyAwarded,
    treasuryChildBountyCanceled,
    treasuryChildBountyClaimed,
  });

  return (
    <div>
      <SubLabel>Child bounties</SubLabel>
      <ToggleItem>
        <div>Child bounties added or canceled</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryChildBountyAdded || treasuryChildBountyCanceled}
          onToggle={changeGuard((isOn) => {
            setTreasuryChildBountyAdded(isOn);
            setTreasuryChildBountyCanceled(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Child bounties claimed or awarded</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryChildBountyAwarded || treasuryChildBountyClaimed}
          onToggle={changeGuard((isOn) => {
            setTreasuryChildBountyAwarded(isOn);
            setTreasuryChildBountyClaimed(isOn);
          })}
        />
      </ToggleItem>
    </div>
  );
}

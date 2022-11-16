import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useTreasuryChildBountyOptions({
  saving,
  disabled,
  ...data
}) {
  const [treasuryChildBountyAdded, setTreasuryChildBountyAdded] = useState(
    !!data.treasuryChildBountyAdded?.isOn
  );
  const [treasuryChildBountyAwarded, setTreasuryChildBountyAwarded] = useState(
    !!data.treasuryChildBountyAwarded?.isOn
  );
  const [treasuryChildBountyCanceled, setTreasuryChildBountyCanceled] =
    useState(!!data.treasuryChildBountyCanceled?.isOn);
  const [treasuryChildBountyClaimed, setTreasuryChildBountyClaimed] = useState(
    !!data.treasuryChildBountyClaimed?.isOn
  );

  const isChanged =
    treasuryChildBountyAdded !== !!data.treasuryChildBountyAdded?.isOn ||
    treasuryChildBountyAwarded !== !!data.treasuryChildBountyAwarded?.isOn ||
    treasuryChildBountyCanceled !== !!data.treasuryChildBountyCanceled?.isOn ||
    treasuryChildBountyClaimed !== !!data.treasuryChildBountyClaimed?.isOn;

  const changeGuard = (setter) => (data) => {
    if (!saving && !disabled) {
      setter(data);
    }
  };

  const getTreasuryChildBountyOptionValues = useCallback(
    () => ({
      treasuryChildBountyAdded,
      treasuryChildBountyAwarded,
      treasuryChildBountyCanceled,
      treasuryChildBountyClaimed,
    }),
    [
      treasuryChildBountyAdded,
      treasuryChildBountyAwarded,
      treasuryChildBountyCanceled,
      treasuryChildBountyClaimed,
    ]
  );

  const treasuryChildBountyOptionsComponent = (
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

  return {
    treasuryChildBountyOptionsComponent,
    getTreasuryChildBountyOptionValues,
    isChanged,
  };
}

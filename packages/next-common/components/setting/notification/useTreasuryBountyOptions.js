import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useTreasuryBountyOptions({ saving, disabled, ...data }) {
  const [treasuryBountyProposed, setTreasuryBountyProposed] = useState(data.treasuryBountyProposed?.isOn);
  const [treasuryBountyAwarded, setTreasuryBountyAwarded] = useState(data.treasuryBountyAwarded?.isOn);
  const [treasuryBountyApproved, setTreasuryBountyApproved] = useState(data.treasuryBountyApproved?.isOn);
  const [treasuryBountyCanceled, setTreasuryBountyCanceled] = useState(data.treasuryBountyCanceled?.isOn);
  const [treasuryBountyClaimed, setTreasuryBountyClaimed] = useState(data.treasuryBountyClaimed?.isOn);
  const [treasuryBountyRejected, setTreasuryBountyRejected] = useState(data.treasuryBountyRejected?.isOn);

  const isChanged = (
    treasuryBountyProposed !== data.treasuryBountyProposed?.isOn ||
    treasuryBountyAwarded !== data.treasuryBountyAwarded?.isOn ||
    treasuryBountyApproved !== data.treasuryBountyApproved?.isOn ||
    treasuryBountyCanceled !== data.treasuryBountyCanceled?.isOn||
    treasuryBountyClaimed !== data.treasuryBountyClaimed?.isOn||
    treasuryBountyRejected !== data.treasuryBountyRejected?.isOn
  );

  const changeGuard = (setter) => (data) => {
    if (!saving && !disabled) {
      setter(data);
    }
  };

  const getTreasuryBountyOptionValues = useCallback(
    () => ({
      treasuryBountyProposed,
      treasuryBountyAwarded,
      treasuryBountyApproved,
      treasuryBountyCanceled,
      treasuryBountyClaimed,
      treasuryBountyRejected,
    }),
    [
      treasuryBountyProposed,
      treasuryBountyAwarded,
      treasuryBountyApproved,
      treasuryBountyCanceled,
      treasuryBountyClaimed,
      treasuryBountyRejected,
    ]
  );

  const treasuryBountyOptionsComponent = (
    <div>
      <SubLabel>Treasury tips</SubLabel>
      <ToggleItem>
        <div>Treasury bounties proposed or canceled</div>
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
        <div>Treasury bounties claimed or awarded</div>
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
        <div>Treasury bounties rejected or approved</div>
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

  return {
    treasuryBountyOptionsComponent,
    getTreasuryBountyOptionValues,
    isChanged,
  };
}

import React, { useEffect } from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useTreasuryBountyOptions({ disabled, ...data }) {
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
  useEffect(() => {
    setIsChanged(true);
  }, [
    treasuryBountyProposed,
    treasuryBountyAwarded,
    treasuryBountyApproved,
    treasuryBountyCanceled,
    treasuryBountyClaimed,
    treasuryBountyRejected,
  ]);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
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
    ],
  );

  const treasuryBountyOptionsComponent = (
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

  return {
    treasuryBountyOptionsComponent,
    getTreasuryBountyOptionValues,
    isChanged,
  };
}

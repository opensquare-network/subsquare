import React, { useEffect } from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useTreasuryProposalOptions({ disabled, ...data }) {
  const [treasuryProposalProposed, setTreasuryProposalProposed] = useState(
    !!data.treasuryProposalProposed?.isOn,
  );
  const [treasuryProposalApproved, setTreasuryProposalApproved] = useState(
    !!data.treasuryProposalApproved?.isOn,
  );
  const [treasuryProposalAwarded, setTreasuryProposalAwarded] = useState(
    !!data.treasuryProposalAwarded?.isOn,
  );
  const [treasuryProposalRejected, setTreasuryProposalRejected] = useState(
    !!data.treasuryProposalRejected?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    setIsChanged(true);
  }, [
    treasuryProposalProposed,
    treasuryProposalApproved,
    treasuryProposalAwarded,
    treasuryProposalRejected,
  ]);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
    }
  };

  const getTreasuryProposalOptionValues = useCallback(
    () => ({
      treasuryProposalProposed,
      treasuryProposalApproved,
      treasuryProposalAwarded,
      treasuryProposalRejected,
    }),
    [
      treasuryProposalProposed,
      treasuryProposalApproved,
      treasuryProposalAwarded,
      treasuryProposalRejected,
    ],
  );

  const treasuryProposalOptionsComponent = (
    <div>
      <SubLabel>Proposals</SubLabel>
      <ToggleItem>
        <div>New proposals</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryProposalProposed}
          onToggle={changeGuard(setTreasuryProposalProposed)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Proposals approved</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryProposalApproved}
          onToggle={changeGuard(setTreasuryProposalApproved)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Proposals awarded or rejected</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryProposalAwarded || treasuryProposalRejected}
          onToggle={changeGuard((isOn) => {
            setTreasuryProposalAwarded(isOn);
            setTreasuryProposalRejected(isOn);
          })}
        />
      </ToggleItem>
    </div>
  );

  return {
    treasuryProposalOptionsComponent,
    getTreasuryProposalOptionValues,
    isChanged,
  };
}

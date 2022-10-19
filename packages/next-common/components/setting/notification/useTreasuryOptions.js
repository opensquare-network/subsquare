import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { Label, Sections, SubLabel, ToggleItem } from "./styled";

export default function useTreasuryOptions({ saving, disabled, ...data }) {
  const [treasuryProposalNew, setTreasuryProposalNew] = useState(data.treasuryProposalNew?.isOn);
  const [treasuryProposalApproved, setTreasuryProposalApproved] = useState(data.treasuryProposalApproved?.isOn);
  const [treasuryProposalAwarded, settreasuryProposalAwarded] = useState(data.treasuryProposalAwarded?.isOn);
  const [treasuryProposalRejected, settreasuryProposalRejected] = useState(data.treasuryProposalRejected?.isOn);

  const changeGuard = (setter) => (data) => {
    if (!saving) {
      setter(data);
    }
  };

  const getTreasuryOptionValues = useCallback(
    () => ({
      treasuryProposalNew,
      treasuryProposalApproved,
      treasuryProposalAwarded,
      treasuryProposalRejected,
    }),
    [
      treasuryProposalNew,
      treasuryProposalApproved,
      treasuryProposalAwarded,
      treasuryProposalRejected,
    ]
  );

  const treasuryOptionsComponent = (
    <div>
      <Label>Treasury</Label>
      <Sections>
        <div>
          <SubLabel>Treasury proposals</SubLabel>
          <ToggleItem>
            <div>New treasury proposals</div>
            <Toggle
              disabled={disabled}
              isOn={treasuryProposalNew}
              onToggle={changeGuard(setTreasuryProposalNew)}
            />
          </ToggleItem>
          <ToggleItem>
            <div>Treasury proposals approved</div>
            <Toggle
              disabled={disabled}
              isOn={treasuryProposalApproved}
              onToggle={changeGuard(setTreasuryProposalApproved)}
            />
          </ToggleItem>
          <ToggleItem>
            <div>Treasury proposals awareded or rejected</div>
            <Toggle
              disabled={disabled}
              isOn={treasuryProposalAwarded || treasuryProposalRejected}
              onToggle={changeGuard((isOn) => {
                settreasuryProposalAwarded(isOn);
                settreasuryProposalRejected(isOn);
              })}
            />
          </ToggleItem>
        </div>
      </Sections>
    </div>
  );

  return {
    treasuryOptionsComponent,
    getTreasuryOptionValues,
  };
}

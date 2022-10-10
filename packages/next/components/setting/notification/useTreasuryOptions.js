import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { Label, Sections, SubLabel, ToggleItem } from "./styled";

export default function useTreasuryOptions({ saving, disabled, ...data }) {
  const [newTreasuryProposal, setNewTreasuryProposal] = useState(data.newTreasuryProposal);
  const [treasuryProposalApprove, setTreasuryProposalApprove] = useState(data.treasuryProposalApprove);
  const [treasuryProposalAwardOrReject, setTreasuryProposalAwardOrReject] = useState(data.treasuryProposalAwardOrReject);

  const changeGuard = (setter) => (data) => {
    if (!saving) {
      setter(data);
    }
  };

  const getTreasuryOptionValues = useCallback(
    () => ({
      newTreasuryProposal,
      treasuryProposalApprove,
      treasuryProposalAwardOrReject,
    }),
    [
      newTreasuryProposal,
      treasuryProposalApprove,
      treasuryProposalAwardOrReject,
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
              isOn={newTreasuryProposal}
              onToggle={changeGuard(setNewTreasuryProposal)}
            />
          </ToggleItem>
          <ToggleItem>
            <div>Treasury proposals approved</div>
            <Toggle
              disabled={disabled}
              isOn={treasuryProposalApprove}
              onToggle={changeGuard(setTreasuryProposalApprove)}
            />
          </ToggleItem>
          <ToggleItem>
            <div>Treasury proposals awareded or rejected</div>
            <Toggle
              disabled={disabled}
              isOn={treasuryProposalAwardOrReject}
              onToggle={changeGuard(setTreasuryProposalAwardOrReject)}
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

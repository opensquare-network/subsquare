import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";

export default function TreasuryProposalOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();

  const [treasuryProposalProposed, setTreasuryProposalProposed] = useState(
    !!subscription.treasuryProposalProposed?.isOn,
  );
  const [treasuryProposalApproved, setTreasuryProposalApproved] = useState(
    !!subscription.treasuryProposalApproved?.isOn,
  );
  const [treasuryProposalAwarded, setTreasuryProposalAwarded] = useState(
    !!subscription.treasuryProposalAwarded?.isOn,
  );
  const [treasuryProposalRejected, setTreasuryProposalRejected] = useState(
    !!subscription.treasuryProposalRejected?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    treasuryProposalProposed,
    treasuryProposalApproved,
    treasuryProposalAwarded,
    treasuryProposalRejected,
  });

  return (
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
}

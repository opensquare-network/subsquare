import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import { useDebounceAutoSaveOnChainOptions } from "./common";

export default function DemocracyProposalOptions({ disabled, ...data }) {
  const [democracyProposalProposed, setDemocracyProposalProposed] = useState(
    !!data.democracyProposalProposed?.isOn,
  );
  const [democracyProposalCanceled, setDemocracyProposalCanceled] = useState(
    !!data.democracyProposalCanceled?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    democracyProposalProposed,
    democracyProposalCanceled,
  });

  return (
    <div>
      <SubLabel>Public Proposals</SubLabel>
      <ToggleItem>
        <div>New public proposals</div>
        <Toggle
          disabled={disabled}
          isOn={democracyProposalProposed}
          onToggle={changeGuard(setDemocracyProposalProposed)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Public proposals canceled</div>
        <Toggle
          disabled={disabled}
          isOn={democracyProposalCanceled}
          onToggle={changeGuard(setDemocracyProposalCanceled)}
        />
      </ToggleItem>
    </div>
  );
}

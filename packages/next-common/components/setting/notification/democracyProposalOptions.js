import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";

export default function DemocracyProposalOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();

  const [democracyProposalProposed, setDemocracyProposalProposed] = useState(
    !!subscription.democracyProposalProposed?.isOn,
  );
  const [democracyProposalCanceled, setDemocracyProposalCanceled] = useState(
    !!subscription.democracyProposalCanceled?.isOn,
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

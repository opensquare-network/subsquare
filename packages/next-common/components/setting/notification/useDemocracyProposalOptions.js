import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useDemocracyProposalOptions({
  saving,
  disabled,
  ...data
}) {
  const [democracyProposalProposed, setDemocracyProposalProposed] = useState(
    !!data.democracyProposalProposed?.isOn
  );
  const [democracyProposalCanceled, setDemocracyProposalCanceled] = useState(
    !!data.democracyProposalCanceled?.isOn
  );

  const isChanged =
    democracyProposalProposed !== !!data.democracyProposalProposed?.isOn ||
    democracyProposalCanceled !== !!data.democracyProposalCanceled?.isOn;

  const changeGuard = (setter) => (data) => {
    if (!saving && !disabled) {
      setter(data);
    }
  };

  const getDemocracyProposalOptionValues = useCallback(
    () => ({
      democracyProposalProposed,
      democracyProposalCanceled,
    }),
    [democracyProposalProposed, democracyProposalCanceled]
  );

  const democracyProposalOptionsComponent = (
    <div>
      <SubLabel>Public Proposals</SubLabel>
      <ToggleItem>
        <div>New public proposal</div>
        <Toggle
          disabled={disabled}
          isOn={democracyProposalProposed}
          onToggle={changeGuard(setDemocracyProposalProposed)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Public proposal canceled</div>
        <Toggle
          disabled={disabled}
          isOn={democracyProposalCanceled}
          onToggle={changeGuard(setDemocracyProposalCanceled)}
        />
      </ToggleItem>
    </div>
  );

  return {
    democracyProposalOptionsComponent,
    getDemocracyProposalOptionValues,
    isChanged,
  };
}

import React, { useEffect } from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useDemocracyProposalOptions({ disabled, ...data }) {
  const [democracyProposalProposed, setDemocracyProposalProposed] = useState(
    !!data.democracyProposalProposed?.isOn,
  );
  const [democracyProposalCanceled, setDemocracyProposalCanceled] = useState(
    !!data.democracyProposalCanceled?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    setIsChanged(true);
  }, [democracyProposalProposed, democracyProposalCanceled]);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
    }
  };

  const getDemocracyProposalOptionValues = useCallback(
    () => ({
      democracyProposalProposed,
      democracyProposalCanceled,
    }),
    [democracyProposalProposed, democracyProposalCanceled],
  );

  const democracyProposalOptionsComponent = (
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

  return {
    democracyProposalOptionsComponent,
    getDemocracyProposalOptionValues,
    isChanged,
  };
}

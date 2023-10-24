import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";

export default function AdvisoryCommitteeOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();

  const [advisoryCommitteeProposed, setAdvisoryCommitteeProposed] = useState(
    !!subscription.advisoryCommitteeProposed?.isOn,
  );
  const [advisoryCommitteeVoted, setAdvisoryCommitteeVoted] = useState(
    !!subscription.advisoryCommitteeVoted?.isOn,
  );
  const [advisoryCommitteeApproved, setAdvisoryCommitteeApproved] = useState(
    !!subscription.advisoryCommitteeApproved?.isOn,
  );
  const [advisoryCommitteeDisApproved, setAdvisoryCommitteeDisApproved] =
    useState(!!subscription.advisoryCommitteeDisApproved?.isOn);

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    advisoryCommitteeProposed,
    advisoryCommitteeVoted,
    advisoryCommitteeApproved,
    advisoryCommitteeDisApproved,
  });

  return (
    <div>
      <SubLabel>Committees</SubLabel>
      <ToggleItem>
        <div>New motions</div>
        <Toggle
          disabled={disabled}
          isOn={advisoryCommitteeProposed}
          onToggle={changeGuard(setAdvisoryCommitteeProposed)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>New vote on motions</div>
        <Toggle
          disabled={disabled}
          isOn={advisoryCommitteeVoted}
          onToggle={changeGuard(setAdvisoryCommitteeVoted)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Committee approved or disapproved</div>
        <Toggle
          disabled={disabled}
          isOn={advisoryCommitteeApproved || advisoryCommitteeDisApproved}
          onToggle={changeGuard((isOn) => {
            setAdvisoryCommitteeApproved(isOn);
            setAdvisoryCommitteeDisApproved(isOn);
          })}
        />
      </ToggleItem>
    </div>
  );
}

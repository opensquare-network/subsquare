import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import { useDebounceAutoSaveOnChainOptions } from "./common";

export default function AdvisoryCommitteeOptions({ disabled, ...data }) {
  const [advisoryCommitteeProposed, setAdvisoryCommitteeProposed] = useState(
    !!data.advisoryCommitteeProposed?.isOn,
  );
  const [advisoryCommitteeVoted, setAdvisoryCommitteeVoted] = useState(
    !!data.advisoryCommitteeVoted?.isOn,
  );
  const [advisoryCommitteeApproved, setAdvisoryCommitteeApproved] = useState(
    !!data.advisoryCommitteeApproved?.isOn,
  );
  const [advisoryCommitteeDisApproved, setAdvisoryCommitteeDisApproved] =
    useState(!!data.advisoryCommitteeDisApproved?.isOn);

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

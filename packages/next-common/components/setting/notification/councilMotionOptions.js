import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import { useDebounceAutoSaveOnChainOptions } from "./common";

export default function CouncilMotionOptions({ disabled, ...data }) {
  const [councilMotionProposed, setCouncilMotionProposed] = useState(
    !!data.councilMotionProposed?.isOn,
  );
  const [councilMotionVoted, setCouncilMotionVoted] = useState(
    !!data.councilMotionVoted?.isOn,
  );
  const [councilMotionApproved, setCouncilMotionApproved] = useState(
    !!data.councilMotionApproved?.isOn,
  );
  const [councilMotionDisApproved, setCouncilMotionDisApproved] = useState(
    !!data.councilMotionDisApproved?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    councilMotionProposed,
    councilMotionVoted,
    councilMotionApproved,
    councilMotionDisApproved,
  });

  return (
    <div>
      <SubLabel>Motions</SubLabel>
      <ToggleItem>
        <div>New motions</div>
        <Toggle
          disabled={disabled}
          isOn={councilMotionProposed}
          onToggle={changeGuard(setCouncilMotionProposed)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>New vote on motions</div>
        <Toggle
          disabled={disabled}
          isOn={councilMotionVoted}
          onToggle={changeGuard(setCouncilMotionVoted)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Motion approved or disapproved</div>
        <Toggle
          disabled={disabled}
          isOn={councilMotionApproved || councilMotionDisApproved}
          onToggle={changeGuard((isOn) => {
            setCouncilMotionApproved(isOn);
            setCouncilMotionDisApproved(isOn);
          })}
        />
      </ToggleItem>
    </div>
  );
}

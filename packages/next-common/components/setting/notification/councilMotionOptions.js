import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";

export default function CouncilMotionOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();

  const [councilMotionProposed, setCouncilMotionProposed] = useState(
    !!subscription.councilMotionProposed?.isOn,
  );
  const [councilMotionVoted, setCouncilMotionVoted] = useState(
    !!subscription.councilMotionVoted?.isOn,
  );
  const [councilMotionApproved, setCouncilMotionApproved] = useState(
    !!subscription.councilMotionApproved?.isOn,
  );
  const [councilMotionDisApproved, setCouncilMotionDisApproved] = useState(
    !!subscription.councilMotionDisApproved?.isOn,
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

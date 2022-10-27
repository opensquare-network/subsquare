import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useCouncilMotionOptions({ saving, disabled, ...data }) {
  const [councilMotionProposed, setCouncilMotionProposed] = useState(data.councilMotionProposed?.isOn);
  const [councilMotionVoted, setCouncilMotionVoted] = useState(data.councilMotionVoted?.isOn);
  const [councilMotionApproved, setCouncilMotionApproved] = useState(data.councilMotionApproved?.isOn);
  const [councilMotionDisApproved, setCouncilMotionDisApproved] = useState(data.councilMotionDisApproved?.isOn);

  const isChanged = (
    councilMotionProposed !== data.councilMotionProposed?.isOn ||
    councilMotionVoted !== data.councilMotionVoted?.isOn ||
    councilMotionApproved !== data.councilMotionApproved?.isOn ||
    councilMotionDisApproved !== data.councilMotionDisApproved?.isOn
  );

  const changeGuard = (setter) => (data) => {
    if (!saving && !disabled) {
      setter(data);
    }
  };

  const getCouncilMotionOptionValues = useCallback(
    () => ({
      councilMotionProposed,
      councilMotionVoted,
      councilMotionApproved,
      councilMotionDisApproved,
    }),
    [
      councilMotionProposed,
      councilMotionVoted,
      councilMotionApproved,
      councilMotionDisApproved,
    ]
  );

  const councilMotionOptionsComponent = (
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
          isOn={councilMotionApproved}
          onToggle={changeGuard(setCouncilMotionApproved)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Motion approved or disapproved</div>
        <Toggle
          disabled={disabled}
          isOn={councilMotionVoted || councilMotionDisApproved}
          onToggle={changeGuard((isOn) => {
            setCouncilMotionVoted(isOn);
            setCouncilMotionDisApproved(isOn);
          })}
        />
      </ToggleItem>
    </div>
  );

  return {
    councilMotionOptionsComponent,
    getCouncilMotionOptionValues,
    isChanged,
  };
}

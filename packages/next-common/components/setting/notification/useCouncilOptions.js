import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { Label, Sections, SubLabel, ToggleItem } from "./styled";

export default function useCouncilOptions({ saving, disabled, ...data }) {
  const [councilMotionProposed, setTreasuryProposalProposed] = useState(data.councilMotionProposed?.isOn);
  const [councilMotionVoted, setCouncilMotionVoted] = useState(data.councilMotionVoted?.isOn);
  const [councilMotionApproved, setTreasuryProposalApproved] = useState(data.councilMotionApproved?.isOn);
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

  const getCouncilOptionValues = useCallback(
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

  const councilOptionsComponent = (
    <div>
      <Label>Council</Label>
      <Sections>
        <div>
          <SubLabel>Motions</SubLabel>
          <ToggleItem>
            <div>New motions</div>
            <Toggle
              disabled={disabled}
              isOn={councilMotionProposed}
              onToggle={changeGuard(setTreasuryProposalProposed)}
            />
          </ToggleItem>
          <ToggleItem>
            <div>New vote on motions</div>
            <Toggle
              disabled={disabled}
              isOn={councilMotionApproved}
              onToggle={changeGuard(setTreasuryProposalApproved)}
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
      </Sections>
    </div>
  );

  return {
    councilOptionsComponent,
    getCouncilOptionValues,
    isChanged,
  };
}

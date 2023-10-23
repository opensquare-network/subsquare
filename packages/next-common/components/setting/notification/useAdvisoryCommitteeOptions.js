import React, { useEffect } from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useAdvisoryCommitteeOptions({ disabled, ...data }) {
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
  useEffect(() => {
    setIsChanged(true);
  }, [
    advisoryCommitteeProposed,
    advisoryCommitteeVoted,
    advisoryCommitteeApproved,
    advisoryCommitteeDisApproved,
  ]);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
    }
  };

  const getAdvisoryCommitteeOptionValues = useCallback(
    () => ({
      advisoryCommitteeProposed,
      advisoryCommitteeVoted,
      advisoryCommitteeApproved,
      advisoryCommitteeDisApproved,
    }),
    [
      advisoryCommitteeProposed,
      advisoryCommitteeVoted,
      advisoryCommitteeApproved,
      advisoryCommitteeDisApproved,
    ],
  );

  const advisoryCommitteeOptionsComponent = (
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

  return {
    advisoryCommitteeOptionsComponent,
    getAdvisoryCommitteeOptionValues,
    isChanged,
  };
}

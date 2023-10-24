import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import { useDebounceAutoSaveOnChainOptions } from "./common";

export default function TechCommMotionOptions({
  isKintsugi,
  disabled,
  ...data
}) {
  const [tcMotionProposed, setTcMotionProposed] = useState(
    !!data.tcMotionProposed?.isOn,
  );
  const [tcMotionVoted, setTcMotionVoted] = useState(
    !!data.tcMotionVoted?.isOn,
  );
  const [tcMotionApproved, setTcMotionApproved] = useState(
    !!data.tcMotionApproved?.isOn,
  );
  const [tcMotionDisApproved, setTcMotionDisApproved] = useState(
    !!data.tcMotionDisApproved?.isOn,
  );
  // for kintsugi/interlay only
  const [tcMotionExecuted, setTcMotionExecuted] = useState(
    !!data.tcMotionExecuted?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  const getTechCommMotionOptionValues = useCallback(() => {
    if (isKintsugi) {
      return { tcMotionExecuted };
    }
    return {
      tcMotionProposed,
      tcMotionVoted,
      tcMotionApproved,
      tcMotionDisApproved,
    };
  }, [
    tcMotionProposed,
    tcMotionVoted,
    tcMotionApproved,
    tcMotionDisApproved,
    tcMotionExecuted,
  ]);

  useDebounceAutoSaveOnChainOptions(isChanged, getTechCommMotionOptionValues());

  if (isKintsugi) {
    return (
      <div>
        <SubLabel>Proposals</SubLabel>
        <ToggleItem>
          <div>Proposals executed</div>
          <Toggle
            disabled={disabled}
            isOn={tcMotionExecuted}
            onToggle={changeGuard(setTcMotionExecuted)}
          />
        </ToggleItem>
      </div>
    );
  }

  return (
    <div>
      <SubLabel>Proposals</SubLabel>
      <ToggleItem>
        <div>New proposals</div>
        <Toggle
          disabled={disabled}
          isOn={tcMotionProposed}
          onToggle={changeGuard(setTcMotionProposed)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>New vote on proposals</div>
        <Toggle
          disabled={disabled}
          isOn={tcMotionVoted}
          onToggle={changeGuard(setTcMotionVoted)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Proposals approved or disapproved</div>
        <Toggle
          disabled={disabled}
          isOn={tcMotionApproved || tcMotionDisApproved}
          onToggle={changeGuard((isOn) => {
            setTcMotionApproved(isOn);
            setTcMotionDisApproved(isOn);
          })}
        />
      </ToggleItem>
    </div>
  );
}

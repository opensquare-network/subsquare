import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useTechCommMotionOptions({
  isKintsugi,
  saving,
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

  const isChanged =
    tcMotionProposed !== !!data.tcMotionProposed?.isOn ||
    tcMotionVoted !== !!data.tcMotionVoted?.isOn ||
    tcMotionApproved !== !!data.tcMotionApproved?.isOn ||
    tcMotionDisApproved !== !!data.tcMotionDisApproved?.isOn ||
    tcMotionExecuted !== !!data.tcMotionExecuted?.isOn;

  const changeGuard = (setter) => (data) => {
    if (!saving && !disabled) {
      setter(data);
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

  let techCommMotionOptionsComponent = null;

  if (isKintsugi) {
    techCommMotionOptionsComponent = (
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
  } else {
    techCommMotionOptionsComponent = (
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

  return {
    techCommMotionOptionsComponent,
    getTechCommMotionOptionValues,
    isChanged,
  };
}

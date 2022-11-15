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
    !!data.tcMotionProposed?.isOn
  );
  const [tcMotionVoted, setTcMotionVoted] = useState(
    !!data.tcMotionVoted?.isOn
  );
  const [tcMotionApproved, setTcMotionApproved] = useState(
    !!data.tcMotionApproved?.isOn
  );
  const [tcMotionDisApproved, setTcMotionDisApproved] = useState(
    !!data.tcMotionDisApproved?.isOn
  );
  // for kintsugi/interlay only
  const [tcMotionExecuted, setTcMotionExecuted] = useState(
    !!data.tcMotionExecuted?.isOn
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

  const getTechCommMotionOptionValues = useCallback(
    () => ({
      tcMotionProposed,
      tcMotionVoted,
      tcMotionApproved,
      tcMotionDisApproved,
      ...(isKintsugi ? { tcMotionExecuted } : {}),
    }),
    [
      tcMotionProposed,
      tcMotionVoted,
      tcMotionApproved,
      tcMotionDisApproved,
      tcMotionExecuted,
    ]
  );

  const techCommMotionOptionsComponent = (
    <div>
      <SubLabel>Motions</SubLabel>
      <ToggleItem>
        <div>New motions</div>
        <Toggle
          disabled={disabled}
          isOn={tcMotionProposed}
          onToggle={changeGuard(setTcMotionProposed)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>New vote on motions</div>
        <Toggle
          disabled={disabled}
          isOn={tcMotionApproved}
          onToggle={changeGuard(setTcMotionApproved)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Motion approved or disapproved</div>
        <Toggle
          disabled={disabled}
          isOn={tcMotionVoted || tcMotionDisApproved}
          onToggle={changeGuard((isOn) => {
            setTcMotionVoted(isOn);
            setTcMotionDisApproved(isOn);
          })}
        />
      </ToggleItem>
      {isKintsugi && (
        <ToggleItem>
          <div>Motion executed</div>
          <Toggle
            disabled={disabled}
            isOn={tcMotionExecuted}
            onToggle={changeGuard(setTcMotionExecuted)}
          />
        </ToggleItem>
      )}
    </div>
  );

  return {
    techCommMotionOptionsComponent,
    getTechCommMotionOptionValues,
    isChanged,
  };
}

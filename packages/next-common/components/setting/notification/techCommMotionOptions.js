import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";
import { useChain } from "next-common/context/chain";

export default function TechCommMotionOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();
  const chain = useChain();
  const isKintsugi = ["kintsugi", "interlay"].includes(chain);

  const [tcMotionProposed, setTcMotionProposed] = useState(
    !!subscription.tcMotionProposed?.isOn,
  );
  const [tcMotionVoted, setTcMotionVoted] = useState(
    !!subscription.tcMotionVoted?.isOn,
  );
  const [tcMotionApproved, setTcMotionApproved] = useState(
    !!subscription.tcMotionApproved?.isOn,
  );
  const [tcMotionDisApproved, setTcMotionDisApproved] = useState(
    !!subscription.tcMotionDisApproved?.isOn,
  );
  // for kintsugi/interlay only
  const [tcMotionExecuted, setTcMotionExecuted] = useState(
    !!subscription.tcMotionExecuted?.isOn,
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
    isKintsugi,
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

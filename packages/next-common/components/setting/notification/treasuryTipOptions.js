import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";

export default function TreasuryTipOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();

  const [treasuryTipNew, setTreasuryTipNew] = useState(
    !!subscription.treasuryTipNew?.isOn,
  );
  const [treasuryTipTip, setTreasuryTipTip] = useState(
    !!subscription.treasuryTipTip?.isOn,
  );
  const [treasuryTipClosed, setTreasuryTipClosed] = useState(
    !!subscription.treasuryTipClosed?.isOn,
  );
  const [treasuryTipRetracted, setTreasuryTipRetracted] = useState(
    !!subscription.treasuryTipRetracted?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    treasuryTipNew,
    treasuryTipTip,
    treasuryTipClosed,
    treasuryTipRetracted,
  });

  return (
    <div>
      <SubLabel>Tips</SubLabel>
      <ToggleItem>
        <div>New tips</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryTipNew}
          onToggle={changeGuard(setTreasuryTipNew)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Tips tipped</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryTipTip}
          onToggle={changeGuard(setTreasuryTipTip)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Tips closed or retracted</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryTipClosed || treasuryTipRetracted}
          onToggle={changeGuard((isOn) => {
            setTreasuryTipClosed(isOn);
            setTreasuryTipRetracted(isOn);
          })}
        />
      </ToggleItem>
    </div>
  );
}

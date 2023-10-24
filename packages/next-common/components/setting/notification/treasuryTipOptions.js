import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import { useDebounceAutoSaveOnChainOptions } from "./common";

export default function TreasuryTipOptions({ disabled, ...data }) {
  const [treasuryTipNew, setTreasuryTipNew] = useState(
    !!data.treasuryTipNew?.isOn,
  );
  const [treasuryTipTip, setTreasuryTipTip] = useState(
    !!data.treasuryTipTip?.isOn,
  );
  const [treasuryTipClosed, setTreasuryTipClosed] = useState(
    !!data.treasuryTipClosed?.isOn,
  );
  const [treasuryTipRetracted, setTreasuryTipRetracted] = useState(
    !!data.treasuryTipRetracted?.isOn,
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

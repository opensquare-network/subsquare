import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useTreasuryTipOptions({ saving, disabled, ...data }) {
  const [treasuryTipNew, setTreasuryTipNew] = useState(
    !!data.treasuryTipNew?.isOn
  );
  const [treasuryTipTip, setTreasuryTipTip] = useState(
    !!data.treasuryTipTip?.isOn
  );
  const [treasuryTipClosed, setTreasuryTipClosed] = useState(
    !!data.treasuryTipClosed?.isOn
  );
  const [treasuryTipRetracted, setTreasuryTipRetracted] = useState(
    !!data.treasuryTipRetracted?.isOn
  );

  const isChanged =
    treasuryTipNew !== !!data.treasuryTipNew?.isOn ||
    treasuryTipTip !== !!data.treasuryTipTip?.isOn ||
    treasuryTipClosed !== !!data.treasuryTipClosed?.isOn ||
    treasuryTipRetracted !== !!data.treasuryTipRetracted?.isOn;

  const changeGuard = (setter) => (data) => {
    if (!saving && !disabled) {
      setter(data);
    }
  };

  const getTreasuryTipOptionValues = useCallback(
    () => ({
      treasuryTipNew,
      treasuryTipTip,
      treasuryTipClosed,
      treasuryTipRetracted,
    }),
    [treasuryTipNew, treasuryTipTip, treasuryTipClosed, treasuryTipRetracted]
  );

  const treasuryTipOptionsComponent = (
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

  return {
    treasuryTipOptionsComponent,
    getTreasuryTipOptionValues,
    isChanged,
  };
}

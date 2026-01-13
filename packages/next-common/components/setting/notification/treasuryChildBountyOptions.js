import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";
import { useNotificationContext } from "../pages/context";
import { cn } from "next-common/utils";

export default function TreasuryChildBountyOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();
  const { isTelegramChannelOn } = useNotificationContext();

  const [treasuryChildBountyAdded, setTreasuryChildBountyAdded] = useState(
    !!subscription.treasuryChildBountyAdded?.isOn,
  );
  const [treasuryChildBountyAwarded, setTreasuryChildBountyAwarded] = useState(
    !!subscription.treasuryChildBountyAwarded?.isOn,
  );
  const [treasuryChildBountyCanceled, setTreasuryChildBountyCanceled] =
    useState(!!subscription.treasuryChildBountyCanceled?.isOn);
  const [treasuryChildBountyClaimed, setTreasuryChildBountyClaimed] = useState(
    !!subscription.treasuryChildBountyClaimed?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    treasuryChildBountyAdded,
    treasuryChildBountyAwarded,
    treasuryChildBountyCanceled,
    treasuryChildBountyClaimed,
  });

  return (
    <div className={cn(!isTelegramChannelOn && "hidden")}>
      <SubLabel>
        Child bounties{" "}
        <span className="text-textTertiary">(Telegram notification only)</span>
      </SubLabel>
      <ToggleItem>
        <div>Child bounties added or canceled</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryChildBountyAdded || treasuryChildBountyCanceled}
          onToggle={changeGuard((isOn) => {
            setTreasuryChildBountyAdded(isOn);
            setTreasuryChildBountyCanceled(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Child bounties claimed or awarded</div>
        <Toggle
          disabled={disabled}
          isOn={treasuryChildBountyAwarded || treasuryChildBountyClaimed}
          onToggle={changeGuard((isOn) => {
            setTreasuryChildBountyAwarded(isOn);
            setTreasuryChildBountyClaimed(isOn);
          })}
        />
      </ToggleItem>
    </div>
  );
}

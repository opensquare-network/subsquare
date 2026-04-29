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

export default function MultiAssetChildBountyOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();
  const { isTelegramChannelOn } = useNotificationContext();

  const [multiAssetChildBountyCreated, setMultiAssetChildBountyCreated] =
    useState(!!subscription.multiAssetChildBountyCreated?.isOn);
  const [multiAssetChildBountyCanceled, setMultiAssetChildBountyCanceled] =
    useState(!!subscription.multiAssetChildBountyCanceled?.isOn);
  const [multiAssetChildBountyFunded, setMultiAssetChildBountyFunded] =
    useState(!!subscription.multiAssetChildBountyFunded?.isOn);
  const [
    multiAssetChildBountyCuratorProposed,
    setMultiAssetChildBountyCuratorProposed,
  ] = useState(!!subscription.multiAssetChildBountyCuratorProposed?.isOn);
  const [
    multiAssetChildBountyCuratorUnassigned,
    setMultiAssetChildBountyCuratorUnassigned,
  ] = useState(!!subscription.multiAssetChildBountyCuratorUnassigned?.isOn);
  const [
    multiAssetChildBountyBecameActive,
    setMultiAssetChildBountyBecameActive,
  ] = useState(!!subscription.multiAssetChildBountyBecameActive?.isOn);
  const [multiAssetChildBountyAwarded, setMultiAssetChildBountyAwarded] =
    useState(!!subscription.multiAssetChildBountyAwarded?.isOn);

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    multiAssetChildBountyCreated,
    multiAssetChildBountyCanceled,
    multiAssetChildBountyFunded,
    multiAssetChildBountyCuratorProposed,
    multiAssetChildBountyCuratorUnassigned,
    multiAssetChildBountyBecameActive,
    multiAssetChildBountyAwarded,
  });

  return (
    <div className={cn(!isTelegramChannelOn && "hidden")}>
      <SubLabel>
        Multi-Asset Child Bounties{" "}
        <span className="text-textTertiary">(Telegram notification only)</span>
      </SubLabel>
      <ToggleItem>
        <div>Child bounties created or canceled</div>
        <Toggle
          disabled={disabled}
          isOn={multiAssetChildBountyCreated || multiAssetChildBountyCanceled}
          onToggle={changeGuard((isOn) => {
            setMultiAssetChildBountyCreated(isOn);
            setMultiAssetChildBountyCanceled(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Child bounties funded</div>
        <Toggle
          disabled={disabled}
          isOn={multiAssetChildBountyFunded}
          onToggle={changeGuard(setMultiAssetChildBountyFunded)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Curator proposed or unassigned</div>
        <Toggle
          disabled={disabled}
          isOn={
            multiAssetChildBountyCuratorProposed ||
            multiAssetChildBountyCuratorUnassigned
          }
          onToggle={changeGuard((isOn) => {
            setMultiAssetChildBountyCuratorProposed(isOn);
            setMultiAssetChildBountyCuratorUnassigned(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Child bounties became active</div>
        <Toggle
          disabled={disabled}
          isOn={multiAssetChildBountyBecameActive}
          onToggle={changeGuard(setMultiAssetChildBountyBecameActive)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Child bounties awarded</div>
        <Toggle
          disabled={disabled}
          isOn={multiAssetChildBountyAwarded}
          onToggle={changeGuard(setMultiAssetChildBountyAwarded)}
        />
      </ToggleItem>
    </div>
  );
}

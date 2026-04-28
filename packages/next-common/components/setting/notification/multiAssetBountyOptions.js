import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";

export default function MultiAssetBountyOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();

  const [multiAssetBountyCreated, setMultiAssetBountyCreated] = useState(
    !!subscription.multiAssetBountyCreated?.isOn,
  );
  const [multiAssetBountyCanceled, setMultiAssetBountyCanceled] = useState(
    !!subscription.multiAssetBountyCanceled?.isOn,
  );
  const [multiAssetBountyFunded, setMultiAssetBountyFunded] = useState(
    !!subscription.multiAssetBountyFunded?.isOn,
  );
  const [multiAssetBountyCuratorProposed, setMultiAssetBountyCuratorProposed] =
    useState(!!subscription.multiAssetBountyCuratorProposed?.isOn);
  const [
    multiAssetBountyCuratorUnassigned,
    setMultiAssetBountyCuratorUnassigned,
  ] = useState(!!subscription.multiAssetBountyCuratorUnassigned?.isOn);
  const [multiAssetBountyBecameActive, setMultiAssetBountyBecameActive] =
    useState(!!subscription.multiAssetBountyBecameActive?.isOn);
  const [multiAssetBountyAwarded, setMultiAssetBountyAwarded] = useState(
    !!subscription.multiAssetBountyAwarded?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    multiAssetBountyCreated,
    multiAssetBountyCanceled,
    multiAssetBountyFunded,
    multiAssetBountyCuratorProposed,
    multiAssetBountyCuratorUnassigned,
    multiAssetBountyBecameActive,
    multiAssetBountyAwarded,
  });

  return (
    <div>
      <SubLabel>Multi-Asset Bounties</SubLabel>
      <ToggleItem>
        <div>Bounties created or canceled</div>
        <Toggle
          disabled={disabled}
          isOn={multiAssetBountyCreated || multiAssetBountyCanceled}
          onToggle={changeGuard((isOn) => {
            setMultiAssetBountyCreated(isOn);
            setMultiAssetBountyCanceled(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Bounties funded</div>
        <Toggle
          disabled={disabled}
          isOn={multiAssetBountyFunded}
          onToggle={changeGuard(setMultiAssetBountyFunded)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Curator proposed or unassigned</div>
        <Toggle
          disabled={disabled}
          isOn={
            multiAssetBountyCuratorProposed || multiAssetBountyCuratorUnassigned
          }
          onToggle={changeGuard((isOn) => {
            setMultiAssetBountyCuratorProposed(isOn);
            setMultiAssetBountyCuratorUnassigned(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Bounties became active</div>
        <Toggle
          disabled={disabled}
          isOn={multiAssetBountyBecameActive}
          onToggle={changeGuard(setMultiAssetBountyBecameActive)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Bounties awarded</div>
        <Toggle
          disabled={disabled}
          isOn={multiAssetBountyAwarded}
          onToggle={changeGuard(setMultiAssetBountyAwarded)}
        />
      </ToggleItem>
    </div>
  );
}

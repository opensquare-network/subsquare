import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";
import { useChain } from "next-common/context/chain";

export default function DemocracyReferendumOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();
  const chain = useChain();
  const isKintsugi = ["kintsugi", "interlay"].includes(chain);

  const [democracyReferendumStarted, setDemocracyReferendumStarted] = useState(
    !!subscription.democracyReferendumStarted?.isOn,
  );
  const [democracyReferendumPassed, setDemocracyReferendumPassed] = useState(
    !!subscription.democracyReferendumPassed?.isOn,
  );
  const [democracyReferendumNotPassed, setDemocracyReferendumNotPassed] =
    useState(!!subscription.democracyReferendumNotPassed?.isOn);
  const [democracyReferendumCancelled, setDemocracyReferendumCancelled] =
    useState(!!subscription.democracyReferendumCancelled?.isOn);
  const [democracyReferendumExecuted, setDemocracyReferendumExecuted] =
    useState(!!subscription.democracyReferendumExecuted?.isOn);
  const [democracyReferendumNotExecuted, setDemocracyReferendumNotExecuted] =
    useState(!!subscription.democracyReferendumNotExecuted?.isOn);
  // for kintsugi/interlay only
  const [democracyReferendumFastTrack, setDemocracyReferendumFastTrack] =
    useState(!!subscription.democracyReferendumFastTrack?.isOn);

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    democracyReferendumStarted,
    democracyReferendumPassed,
    democracyReferendumNotPassed,
    democracyReferendumCancelled,
    democracyReferendumExecuted,
    democracyReferendumNotExecuted,
    democracyReferendumFastTrack,
  });

  return (
    <div>
      <SubLabel>Referenda</SubLabel>
      <ToggleItem>
        <div>Referendum started</div>
        <Toggle
          disabled={disabled}
          isOn={democracyReferendumStarted}
          onToggle={changeGuard(setDemocracyReferendumStarted)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum passed or not-passed</div>
        <Toggle
          disabled={disabled}
          isOn={democracyReferendumPassed || democracyReferendumNotPassed}
          onToggle={changeGuard((isOn) => {
            setDemocracyReferendumPassed(isOn);
            setDemocracyReferendumNotPassed(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum canceled</div>
        <Toggle
          disabled={disabled}
          isOn={democracyReferendumCancelled}
          onToggle={changeGuard(setDemocracyReferendumCancelled)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum executed or not-executed</div>
        <Toggle
          disabled={disabled}
          isOn={democracyReferendumExecuted || democracyReferendumNotExecuted}
          onToggle={changeGuard((isOn) => {
            setDemocracyReferendumExecuted(isOn);
            setDemocracyReferendumNotExecuted(isOn);
          })}
        />
      </ToggleItem>
      {isKintsugi && (
        <ToggleItem>
          <div>Referendum fast-tracked</div>
          <Toggle
            disabled={disabled}
            isOn={democracyReferendumFastTrack}
            onToggle={changeGuard(setDemocracyReferendumFastTrack)}
          />
        </ToggleItem>
      )}
    </div>
  );
}

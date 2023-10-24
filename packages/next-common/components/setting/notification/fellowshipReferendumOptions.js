import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";

export default function FellowshipReferendumOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();

  const [fellowshipSubmitted, setFellowshipSubmitted] = useState(
    !!subscription.fellowshipSubmitted?.isOn,
  );
  const [fellowshipDecisionStarted, setFellowshipDecisionStarted] = useState(
    !!subscription.fellowshipDecisionStarted?.isOn,
  );
  const [fellowshipConfirmStarted, setFellowshipConfirmStarted] = useState(
    !!subscription.fellowshipConfirmStarted?.isOn,
  );
  const [fellowshipCancelled, setFellowshipCancelled] = useState(
    !!subscription.fellowshipCancelled?.isOn,
  );
  const [fellowshipConfirmAborted, setFellowshipConfirmAborted] = useState(
    !!subscription.fellowshipConfirmAborted?.isOn,
  );
  const [fellowshipConfirmed, setFellowshipConfirmed] = useState(
    !!subscription.fellowshipConfirmed?.isOn,
  );
  const [fellowshipExecuted, setFellowshipExecuted] = useState(
    !!subscription.fellowshipExecuted?.isOn,
  );
  const [fellowshipKilled, setFellowshipKilled] = useState(
    !!subscription.fellowshipKilled?.isOn,
  );
  const [fellowshipTimedout, setFellowshipTimedout] = useState(
    !!subscription.fellowshipTimedout?.isOn,
  );
  const [fellowshipRejected, setFellowshipRejected] = useState(
    !!subscription.fellowshipRejected?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
    fellowshipSubmitted,
    fellowshipDecisionStarted,
    fellowshipConfirmStarted,
    fellowshipCancelled,
    fellowshipExecuted,
    fellowshipConfirmAborted,
    fellowshipConfirmed,
    fellowshipKilled,
    fellowshipTimedout,
    fellowshipRejected,
  });

  return (
    <div>
      <SubLabel>Fellowship</SubLabel>
      <ToggleItem>
        <div>Fellowship referendum submitted</div>
        <Toggle
          disabled={disabled}
          isOn={fellowshipSubmitted}
          onToggle={changeGuard(setFellowshipSubmitted)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Fellowship referendum decision started</div>
        <Toggle
          disabled={disabled}
          isOn={fellowshipDecisionStarted}
          onToggle={changeGuard(setFellowshipDecisionStarted)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Fellowship referendum confirm started or aborted</div>
        <Toggle
          disabled={disabled}
          isOn={fellowshipConfirmStarted || fellowshipConfirmAborted}
          onToggle={changeGuard((isOn) => {
            setFellowshipConfirmStarted(isOn);
            setFellowshipConfirmAborted(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Fellowship referendum confirmed/rejected/timed-out/killed</div>
        <Toggle
          disabled={disabled}
          isOn={
            fellowshipConfirmed ||
            fellowshipRejected ||
            fellowshipTimedout ||
            fellowshipKilled
          }
          onToggle={changeGuard((isOn) => {
            setFellowshipConfirmed(isOn);
            setFellowshipRejected(isOn);
            setFellowshipTimedout(isOn);
            setFellowshipKilled(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Fellowship referendum executed or canceled</div>
        <Toggle
          disabled={disabled}
          isOn={fellowshipExecuted || fellowshipCancelled}
          onToggle={changeGuard((isOn) => {
            setFellowshipExecuted(isOn);
            setFellowshipCancelled(isOn);
          })}
        />
      </ToggleItem>
    </div>
  );
}

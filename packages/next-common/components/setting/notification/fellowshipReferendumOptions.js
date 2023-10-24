import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import { useDebounceAutoSaveOnChainOptions } from "./common";

export default function FellowshipReferendumOptions({ disabled, ...data }) {
  const [fellowshipSubmitted, setFellowshipSubmitted] = useState(
    !!data.fellowshipSubmitted?.isOn,
  );
  const [fellowshipDecisionStarted, setFellowshipDecisionStarted] = useState(
    !!data.fellowshipDecisionStarted?.isOn,
  );
  const [fellowshipConfirmStarted, setFellowshipConfirmStarted] = useState(
    !!data.fellowshipConfirmStarted?.isOn,
  );
  const [fellowshipCancelled, setFellowshipCancelled] = useState(
    !!data.fellowshipCancelled?.isOn,
  );
  const [fellowshipConfirmAborted, setFellowshipConfirmAborted] = useState(
    !!data.fellowshipConfirmAborted?.isOn,
  );
  const [fellowshipConfirmed, setFellowshipConfirmed] = useState(
    !!data.fellowshipConfirmed?.isOn,
  );
  const [fellowshipExecuted, setFellowshipExecuted] = useState(
    !!data.fellowshipExecuted?.isOn,
  );
  const [fellowshipKilled, setFellowshipKilled] = useState(
    !!data.fellowshipKilled?.isOn,
  );
  const [fellowshipTimedout, setFellowshipTimedout] = useState(
    !!data.fellowshipTimedout?.isOn,
  );
  const [fellowshipRejected, setFellowshipRejected] = useState(
    !!data.fellowshipRejected?.isOn,
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

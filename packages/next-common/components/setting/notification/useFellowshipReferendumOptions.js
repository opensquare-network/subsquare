import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useFellowshipReferendumOptions({
  saving,
  disabled,
  ...data
}) {
  const [fellowshipSubmitted, setFellowshipSubmitted] = useState(
    !!data.fellowshipSubmitted?.isOn
  );
  const [fellowshipDecisionStarted, setFellowshipDecisionStarted] = useState(
    !!data.fellowshipDecisionStarted?.isOn
  );
  const [fellowshipConfirmStarted, setFellowshipConfirmStarted] = useState(
    !!data.fellowshipConfirmStarted?.isOn
  );
  const [fellowshipCancelled, setFellowshipCancelled] = useState(
    !!data.fellowshipCancelled?.isOn
  );
  const [fellowshipConfirmAborted, setFellowshipConfirmAborted] = useState(
    !!data.fellowshipConfirmAborted?.isOn
  );
  const [fellowshipConfirmed, setFellowshipConfirmed] = useState(
    !!data.fellowshipConfirmed?.isOn
  );
  const [fellowshipExecuted, setFellowshipExecuted] = useState(
    !!data.fellowshipExecuted?.isOn
  );
  const [fellowshipKilled, setFellowshipKilled] = useState(
    !!data.fellowshipKilled?.isOn
  );
  const [fellowshipTimedout, setFellowshipTimedout] = useState(
    !!data.fellowshipTimedout?.isOn
  );
  const [fellowshipRejected, setFellowshipRejected] = useState(
    !!data.fellowshipRejected?.isOn
  );

  const isChanged =
    fellowshipSubmitted !== !!data.fellowshipSubmitted?.isOn ||
    fellowshipDecisionStarted !== !!data.fellowshipDecisionStarted?.isOn ||
    fellowshipConfirmStarted !== !!data.fellowshipConfirmStarted?.isOn ||
    fellowshipCancelled !== !!data.fellowshipCancelled?.isOn ||
    fellowshipExecuted !== !!data.fellowshipExecuted?.isOn ||
    fellowshipConfirmAborted !== !!data.fellowshipConfirmAborted?.isOn ||
    fellowshipConfirmed !== !!data.fellowshipConfirmed?.isOn ||
    fellowshipKilled !== !!data.fellowshipKilled?.isOn ||
    fellowshipTimedout !== !!data.fellowshipTimedout?.isOn ||
    fellowshipRejected !== !!data.fellowshipRejected?.isOn;

  const changeGuard = (setter) => (data) => {
    if (!saving && !disabled) {
      setter(data);
    }
  };

  const getFellowshipReferendumOptionValues = useCallback(
    () => ({
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
    }),
    [
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
    ]
  );

  const fellowshipReferendumOptionsComponent = (
    <div>
      <SubLabel>Fellowship</SubLabel>
      <ToggleItem>
        <div>Fellowship submitted</div>
        <Toggle
          disabled={disabled}
          isOn={fellowshipSubmitted}
          onToggle={changeGuard(setFellowshipSubmitted)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Fellowship decision started</div>
        <Toggle
          disabled={disabled}
          isOn={fellowshipDecisionStarted}
          onToggle={changeGuard(setFellowshipDecisionStarted)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Fellowship canceled</div>
        <Toggle
          disabled={disabled}
          isOn={fellowshipCancelled}
          onToggle={changeGuard(setFellowshipCancelled)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Fellowship confirm started or aborted</div>
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
        <div>Fellowship confirmed, or rejected, or timed-out, or killed</div>
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
        <div>Fellowship executed</div>
        <Toggle
          disabled={disabled}
          isOn={fellowshipExecuted}
          onToggle={changeGuard(setFellowshipExecuted)}
        />
      </ToggleItem>
    </div>
  );

  return {
    fellowshipReferendumOptionsComponent,
    getFellowshipReferendumOptionValues,
    isChanged,
  };
}

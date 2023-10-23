import React, { useEffect } from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useReferendaReferendumOptions({ disabled, ...data }) {
  const [referendaSubmitted, setReferendaSubmitted] = useState(
    !!data.referendaSubmitted?.isOn,
  );
  const [referendaDecisionStarted, setReferendaDecisionStarted] = useState(
    !!data.referendaDecisionStarted?.isOn,
  );
  const [referendaConfirmStarted, setReferendaConfirmStarted] = useState(
    !!data.referendaConfirmStarted?.isOn,
  );
  const [referendaCancelled, setReferendaCancelled] = useState(
    !!data.referendaCancelled?.isOn,
  );
  const [referendaConfirmAborted, setReferendaConfirmAborted] = useState(
    !!data.referendaConfirmAborted?.isOn,
  );
  const [referendaConfirmed, setReferendaConfirmed] = useState(
    !!data.referendaConfirmed?.isOn,
  );
  const [referendaExecuted, setReferendaExecuted] = useState(
    !!data.referendaExecuted?.isOn,
  );
  const [referendaKilled, setReferendaKilled] = useState(
    !!data.referendaKilled?.isOn,
  );
  const [referendaTimedout, setReferendaTimedout] = useState(
    !!data.referendaTimedout?.isOn,
  );
  const [referendaRejected, setReferendaRejected] = useState(
    !!data.referendaRejected?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    setIsChanged(true);
  }, [
    referendaSubmitted,
    referendaDecisionStarted,
    referendaConfirmStarted,
    referendaCancelled,
    referendaExecuted,
    referendaConfirmAborted,
    referendaConfirmed,
    referendaKilled,
    referendaTimedout,
    referendaRejected,
  ]);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
    }
  };

  const getReferendaReferendumOptionValues = useCallback(
    () => ({
      referendaSubmitted,
      referendaDecisionStarted,
      referendaConfirmStarted,
      referendaCancelled,
      referendaExecuted,
      referendaConfirmAborted,
      referendaConfirmed,
      referendaKilled,
      referendaTimedout,
      referendaRejected,
    }),
    [
      referendaSubmitted,
      referendaDecisionStarted,
      referendaConfirmStarted,
      referendaCancelled,
      referendaExecuted,
      referendaConfirmAborted,
      referendaConfirmed,
      referendaKilled,
      referendaTimedout,
      referendaRejected,
    ],
  );

  const referendaReferendumOptionsComponent = (
    <div>
      <SubLabel>Referenda</SubLabel>
      <ToggleItem>
        <div>Referendum submitted</div>
        <Toggle
          disabled={disabled}
          isOn={referendaSubmitted}
          onToggle={changeGuard(setReferendaSubmitted)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum decision started</div>
        <Toggle
          disabled={disabled}
          isOn={referendaDecisionStarted}
          onToggle={changeGuard(setReferendaDecisionStarted)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum confirm started or aborted</div>
        <Toggle
          disabled={disabled}
          isOn={referendaConfirmStarted || referendaConfirmAborted}
          onToggle={changeGuard((isOn) => {
            setReferendaConfirmStarted(isOn);
            setReferendaConfirmAborted(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum confirmed/rejected/timed-out/killed</div>
        <Toggle
          disabled={disabled}
          isOn={
            referendaConfirmed ||
            referendaRejected ||
            referendaTimedout ||
            referendaKilled
          }
          onToggle={changeGuard((isOn) => {
            setReferendaConfirmed(isOn);
            setReferendaRejected(isOn);
            setReferendaTimedout(isOn);
            setReferendaKilled(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum executed or canceled</div>
        <Toggle
          disabled={disabled}
          isOn={referendaExecuted || referendaCancelled}
          onToggle={(isOn) => {
            setReferendaExecuted(isOn);
            setReferendaCancelled(isOn);
          }}
        />
      </ToggleItem>
    </div>
  );

  return {
    referendaReferendumOptionsComponent,
    getReferendaReferendumOptionValues,
    isChanged,
  };
}

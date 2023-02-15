import React from "react";
import Toggle from "next-common/components/toggle";
import { useCallback, useState } from "react";
import { SubLabel, ToggleItem } from "./styled";

export default function useReferendaReferendumOptions({
  saving,
  disabled,
  ...data
}) {
  const [referendaSubmitted, setReferendaSubmitted] = useState(
    !!data.referendaSubmitted?.isOn
  );
  const [referendaDecisionStarted, setReferendaDecisionStarted] = useState(
    !!data.referendaDecisionStarted?.isOn
  );
  const [referendaConfirmStarted, setReferendaConfirmStarted] = useState(
    !!data.referendaConfirmStarted?.isOn
  );
  const [referendaCancelled, setReferendaCancelled] = useState(
    !!data.referendaCancelled?.isOn
  );
  const [referendaConfirmAborted, setReferendaConfirmAborted] = useState(
    !!data.referendaConfirmAborted?.isOn
  );
  const [referendaConfirmed, setReferendaConfirmed] = useState(
    !!data.referendaConfirmed?.isOn
  );
  const [referendaExecuted, setReferendaExecuted] = useState(
    !!data.referendaExecuted?.isOn
  );
  const [referendaKilled, setReferendaKilled] = useState(
    !!data.referendaKilled?.isOn
  );
  const [referendaTimedout, setReferendaTimedout] = useState(
    !!data.referendaTimedout?.isOn
  );
  const [referendaRejected, setReferendaRejected] = useState(
    !!data.referendaRejected?.isOn
  );

  const isChanged =
    referendaSubmitted !== !!data.referendaSubmitted?.isOn ||
    referendaDecisionStarted !== !!data.referendaDecisionStarted?.isOn ||
    referendaConfirmStarted !== !!data.referendaConfirmStarted?.isOn ||
    referendaCancelled !== !!data.referendaCancelled?.isOn ||
    referendaExecuted !== !!data.referendaExecuted?.isOn ||
    referendaConfirmAborted !== !!data.referendaConfirmAborted?.isOn ||
    referendaConfirmed !== !!data.referendaConfirmed?.isOn ||
    referendaKilled !== !!data.referendaKilled?.isOn ||
    referendaTimedout !== !!data.referendaTimedout?.isOn ||
    referendaRejected !== !!data.referendaRejected?.isOn;

  const changeGuard = (setter) => (data) => {
    if (!saving && !disabled) {
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
    ]
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
        <div>Referendum canceled</div>
        <Toggle
          disabled={disabled}
          isOn={referendaCancelled}
          onToggle={changeGuard(setReferendaCancelled)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum confirm started or confirm aborted</div>
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
        <div>Referendum confirmed</div>
        <Toggle
          disabled={disabled}
          isOn={referendaConfirmed}
          onToggle={changeGuard(setReferendaConfirmed)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum executed or rejected</div>
        <Toggle
          disabled={disabled}
          isOn={referendaExecuted || referendaRejected}
          onToggle={changeGuard((isOn) => {
            setReferendaExecuted(isOn);
            setReferendaRejected(isOn);
          })}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum timed-out</div>
        <Toggle
          disabled={disabled}
          isOn={referendaTimedout}
          onToggle={changeGuard(setReferendaTimedout)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Referendum killed</div>
        <Toggle
          disabled={disabled}
          isOn={referendaKilled}
          onToggle={changeGuard(setReferendaKilled)}
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

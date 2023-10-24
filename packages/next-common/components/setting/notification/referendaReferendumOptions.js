import React from "react";
import Toggle from "next-common/components/toggle";
import { useState } from "react";
import { SubLabel, ToggleItem } from "./styled";
import {
  useDebounceAutoSaveOnChainOptions,
  useIsOnChainOptionsDisabled,
} from "./common";
import { usePageProps } from "next-common/context/page";

export default function ReferendaReferendumOptions() {
  const disabled = useIsOnChainOptionsDisabled();
  const { subscription } = usePageProps();

  const [referendaSubmitted, setReferendaSubmitted] = useState(
    !!subscription.referendaSubmitted?.isOn,
  );
  const [referendaDecisionStarted, setReferendaDecisionStarted] = useState(
    !!subscription.referendaDecisionStarted?.isOn,
  );
  const [referendaConfirmStarted, setReferendaConfirmStarted] = useState(
    !!subscription.referendaConfirmStarted?.isOn,
  );
  const [referendaCancelled, setReferendaCancelled] = useState(
    !!subscription.referendaCancelled?.isOn,
  );
  const [referendaConfirmAborted, setReferendaConfirmAborted] = useState(
    !!subscription.referendaConfirmAborted?.isOn,
  );
  const [referendaConfirmed, setReferendaConfirmed] = useState(
    !!subscription.referendaConfirmed?.isOn,
  );
  const [referendaExecuted, setReferendaExecuted] = useState(
    !!subscription.referendaExecuted?.isOn,
  );
  const [referendaKilled, setReferendaKilled] = useState(
    !!subscription.referendaKilled?.isOn,
  );
  const [referendaTimedout, setReferendaTimedout] = useState(
    !!subscription.referendaTimedout?.isOn,
  );
  const [referendaRejected, setReferendaRejected] = useState(
    !!subscription.referendaRejected?.isOn,
  );

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveOnChainOptions(isChanged, {
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
  });

  return (
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
}

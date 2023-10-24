import ReferendaReferendumOptions from "next-common/components/setting/notification/referendaReferendumOptions";
import FellowshipReferendumOptions from "next-common/components/setting/notification/fellowshipReferendumOptions";
import { useChainSettings } from "next-common/context/chain";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";

export default function OpenGovSubscription({ subscription, disabled }) {
  const { hasFellowship, hasReferenda } = useChainSettings();

  if (!hasFellowship && !hasReferenda) {
    return null;
  }

  return (
    <AccordionCard title="Open Gov" defaultOpen={true}>
      <Options>
        {hasReferenda && (
          <ReferendaReferendumOptions
            disabled={disabled}
            referendaSubmitted={subscription?.referendaSubmitted}
            referendaDecisionStarted={subscription?.referendaDecisionStarted}
            referendaConfirmStarted={subscription?.referendaConfirmStarted}
            referendaCancelled={subscription?.referendaCancelled}
            referendaConfirmAborted={subscription?.referendaConfirmAborted}
            referendaConfirmed={subscription?.referendaConfirmed}
            referendaExecuted={subscription?.referendaExecuted}
            referendaKilled={subscription?.referendaKilled}
            referendaTimedout={subscription?.referendaTimedout}
            referendaRejected={subscription?.referendaRejected}
          />
        )}
        {hasFellowship && (
          <FellowshipReferendumOptions
            disabled={disabled}
            fellowshipSubmitted={subscription?.fellowshipSubmitted}
            fellowshipDecisionStarted={subscription?.fellowshipDecisionStarted}
            fellowshipConfirmStarted={subscription?.fellowshipConfirmStarted}
            fellowshipCancelled={subscription?.fellowshipCancelled}
            fellowshipConfirmAborted={subscription?.fellowshipConfirmAborted}
            fellowshipConfirmed={subscription?.fellowshipConfirmed}
            fellowshipExecuted={subscription?.fellowshipExecuted}
            fellowshipKilled={subscription?.fellowshipKilled}
            fellowshipTimedout={subscription?.fellowshipTimedout}
            fellowshipRejected={subscription?.fellowshipRejected}
          />
        )}
      </Options>
    </AccordionCard>
  );
}

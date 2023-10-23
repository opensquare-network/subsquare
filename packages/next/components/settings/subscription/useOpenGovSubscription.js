import useReferendaReferendumOptions from "next-common/components/setting/notification/useReferendaReferendumOptions";
import useFellowshipReferendumOptions from "next-common/components/setting/notification/useFellowshipReferendumOptions";
import { useChainSettings } from "next-common/context/chain";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";

export default function useOpenGovSubscription(subscription, disabled) {
  const { hasFellowship, hasReferenda } = useChainSettings();

  const {
    referendaReferendumOptionsComponent,
    getReferendaReferendumOptionValues,
    isChanged: isReferendaReferendumOptionsChanged,
  } = useReferendaReferendumOptions({
    disabled,
    referendaSubmitted: subscription?.referendaSubmitted,
    referendaDecisionStarted: subscription?.referendaDecisionStarted,
    referendaConfirmStarted: subscription?.referendaConfirmStarted,
    referendaCancelled: subscription?.referendaCancelled,
    referendaConfirmAborted: subscription?.referendaConfirmAborted,
    referendaConfirmed: subscription?.referendaConfirmed,
    referendaExecuted: subscription?.referendaExecuted,
    referendaKilled: subscription?.referendaKilled,
    referendaTimedout: subscription?.referendaTimedout,
    referendaRejected: subscription?.referendaRejected,
  });

  const {
    fellowshipReferendumOptionsComponent,
    getFellowshipReferendumOptionValues,
    isChanged: isFellowshipReferendumOptionsChanged,
  } = useFellowshipReferendumOptions({
    disabled,
    fellowshipSubmitted: subscription?.fellowshipSubmitted,
    fellowshipDecisionStarted: subscription?.fellowshipDecisionStarted,
    fellowshipConfirmStarted: subscription?.fellowshipConfirmStarted,
    fellowshipCancelled: subscription?.fellowshipCancelled,
    fellowshipConfirmAborted: subscription?.fellowshipConfirmAborted,
    fellowshipConfirmed: subscription?.fellowshipConfirmed,
    fellowshipExecuted: subscription?.fellowshipExecuted,
    fellowshipKilled: subscription?.fellowshipKilled,
    fellowshipTimedout: subscription?.fellowshipTimedout,
    fellowshipRejected: subscription?.fellowshipRejected,
  });

  let openGovOptions = null;
  if (hasFellowship || hasReferenda) {
    openGovOptions = (
      <AccordionCard title="Open Gov" defaultOpen={true}>
        <Options>
          {hasReferenda && referendaReferendumOptionsComponent}
          {hasFellowship && fellowshipReferendumOptionsComponent}
        </Options>
      </AccordionCard>
    );
  }

  return {
    openGovOptions,
    isOpenGovOptionsChanged:
      isReferendaReferendumOptionsChanged ||
      isFellowshipReferendumOptionsChanged,
    getOpenGovOptionValues: () => {
      return {
        ...(hasReferenda ? getReferendaReferendumOptionValues() : {}),
        ...(hasFellowship ? getFellowshipReferendumOptionValues() : {}),
      };
    },
  };
}

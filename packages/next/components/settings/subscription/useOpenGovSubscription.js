import FoldableSections from "next-common/components/setting/notification/foldableSections";
import useReferendaReferendumOptions from "next-common/components/setting/notification/useReferendaReferendumOptions";
import useFellowshipReferendumOptions from "next-common/components/setting/notification/useFellowshipReferendumOptions";
import { useChainSettings } from "next-common/context/chain";

export default function useOpenGovSubscription(
  subscription,
  saving,
  isVerifiedUser
) {
  const { hasGov2, noFellowship, noReferenda } = useChainSettings();

  const {
    referendaReferendumOptionsComponent,
    getReferendaReferendumOptionValues,
    isChanged: isReferendaReferendumOptionsChanged,
  } = useReferendaReferendumOptions({
    disabled: !isVerifiedUser,
    saving,
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
    disabled: !isVerifiedUser,
    saving,
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
  if (hasGov2) {
    openGovOptions = (
      <FoldableSections title="Open Gov">
        {!noReferenda && referendaReferendumOptionsComponent}
        {!noFellowship && fellowshipReferendumOptionsComponent}
      </FoldableSections>
    );
  }

  return {
    openGovOptions,
    isOpenGovOptionsChanged:
      isReferendaReferendumOptionsChanged ||
      isFellowshipReferendumOptionsChanged,
    getOpenGovOptionValues: () => {
      if (hasGov2) {
        return {
          ...(noReferenda ? {} : getReferendaReferendumOptionValues()),
          ...(noFellowship ? {} : getFellowshipReferendumOptionValues()),
        };
      }
      return {};
    },
  };
}

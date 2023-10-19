import { useState } from "react";
import nextApi from "next-common/services/nextApi";
import useTreasuryProposalOptions from "next-common/components/setting/notification/useTreasuryProposalOptions";
import useTechCommMotionOptions from "next-common/components/setting/notification/useTechCommMotionOptions";
import useDemocracyProposalOptions from "next-common/components/setting/notification/useDemocracyProposalOptions";
import useDemocracyReferendumOptions from "next-common/components/setting/notification/useDemocracyReferendumOptions";
import FoldableSections from "next-common/components/setting/notification/foldableSections";
import { Options } from "next-common/components/setting/notification/styled";
import { useUser } from "next-common/context/user";

export default function useSubscription({ subscription: _subscription }) {
  const loginUser = useUser();
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState(_subscription);

  const isVerifiedUser = loginUser?.emailVerified;
  const telegramLinked = loginUser?.telegram?.chat;
  const disabled = !isVerifiedUser && !telegramLinked;

  const {
    treasuryProposalOptionsComponent,
    getTreasuryProposalOptionValues,
    isChanged: isTreasuryProposalOptionsChanged,
  } = useTreasuryProposalOptions({
    disabled,
    saving,
    treasuryProposalProposed: subscription?.treasuryProposalProposed,
    treasuryProposalApproved: subscription?.treasuryProposalApproved,
    treasuryProposalAwarded: subscription?.treasuryProposalAwarded,
    treasuryProposalRejected: subscription?.treasuryProposalRejected,
  });

  const {
    techCommMotionOptionsComponent,
    getTechCommMotionOptionValues,
    isChanged: isTechCommMotionOptionsChanged,
  } = useTechCommMotionOptions({
    isKintsugi: true,
    disabled,
    saving,
    tcMotionExecuted: subscription?.tcMotionExecuted,
  });

  const {
    democracyProposalOptionsComponent,
    getDemocracyProposalOptionValues,
    isChanged: isDemocracyProposalOptionsChanged,
  } = useDemocracyProposalOptions({
    disabled,
    saving,
    democracyProposalProposed: subscription?.democracyProposalProposed,
    democracyProposalCanceled: subscription?.democracyProposalCanceled,
  });

  const {
    democracyReferendumOptionsComponent,
    getDemocracyReferendumOptionValues,
    isChanged: isDemocracyReferendumOptionsChanged,
  } = useDemocracyReferendumOptions({
    isKintsugi: true,
    disabled,
    saving,
    democracyReferendumStarted: subscription?.democracyReferendumStarted,
    democracyReferendumPassed: subscription?.democracyReferendumPassed,
    democracyReferendumNotPassed: subscription?.democracyReferendumNotPassed,
    democracyReferendumCancelled: subscription?.democracyReferendumCancelled,
    democracyReferendumExecuted: subscription?.democracyReferendumExecuted,
    democracyReferendumNotExecuted:
      subscription?.democracyReferendumNotExecuted,
    democracyReferendumFastTrack: subscription?.democracyReferendumFastTrack,
  });

  const canSave =
    !disabled &&
    (isTreasuryProposalOptionsChanged ||
      isTechCommMotionOptionsChanged ||
      isDemocracyProposalOptionsChanged ||
      isDemocracyReferendumOptionsChanged);

  const fetchSubscriptionSetting = async () => {
    const { result } = await nextApi.fetch("user/subscription");
    if (result) {
      setSubscription(result);
    }
  };

  const updateSubscriptionSetting = async () => {
    setSaving(true);

    const data = {
      ...getTreasuryProposalOptionValues(),
      ...getTechCommMotionOptionValues(),
      ...getDemocracyProposalOptionValues(),
      ...getDemocracyReferendumOptionValues(),
    };

    const { result, error } = await nextApi.patch("user/subscription", data);
    if (result) {
      await fetchSubscriptionSetting();
    }
    setSaving(false);

    return { result, error };
  };

  const subscriptionComponent = (
    <Options>
      <FoldableSections title="Treasury">
        {treasuryProposalOptionsComponent}
      </FoldableSections>
      <FoldableSections title="Tech-Comm.">
        {techCommMotionOptionsComponent}
      </FoldableSections>
      <FoldableSections title="Democracy">
        {democracyProposalOptionsComponent}
        {democracyReferendumOptionsComponent}
      </FoldableSections>
    </Options>
  );

  return {
    subscriptionComponent,
    isSubscriptionChanged: canSave,
    updateSubscriptionSetting,
  };
}

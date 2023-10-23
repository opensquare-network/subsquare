import { useMemo } from "react";
import nextApi from "next-common/services/nextApi";
import useTreasuryProposalOptions from "next-common/components/setting/notification/useTreasuryProposalOptions";
import useTechCommMotionOptions from "next-common/components/setting/notification/useTechCommMotionOptions";
import useDemocracyProposalOptions from "next-common/components/setting/notification/useDemocracyProposalOptions";
import useDemocracyReferendumOptions from "next-common/components/setting/notification/useDemocracyReferendumOptions";
import { Options } from "next-common/components/setting/notification/styled";
import { useUser } from "next-common/context/user";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import useDeepCompareEffect from "use-deep-compare-effect";
import { useDispatch } from "react-redux";
import { usePageProps } from "next-common/context/page";
import debounce from "lodash.debounce";
import AccordionCard from "next-common/components/styled/containers/accordionCard";

export default function OnChainEventsSubscription() {
  const dispatch = useDispatch();
  const loginUser = useUser();
  const { subscription } = usePageProps();

  const isVerifiedUser = loginUser?.emailVerified;
  const telegramLinked = loginUser?.telegram?.chat;
  const disabled = !isVerifiedUser && !telegramLinked;

  const {
    treasuryProposalOptionsComponent,
    getTreasuryProposalOptionValues,
    isChanged: isTreasuryProposalOptionsChanged,
  } = useTreasuryProposalOptions({
    disabled,
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
    tcMotionExecuted: subscription?.tcMotionExecuted,
  });

  const {
    democracyProposalOptionsComponent,
    getDemocracyProposalOptionValues,
    isChanged: isDemocracyProposalOptionsChanged,
  } = useDemocracyProposalOptions({
    disabled,
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

  const onchainOptionValues = {
    ...getTreasuryProposalOptionValues(),
    ...getTechCommMotionOptionValues(),
    ...getDemocracyProposalOptionValues(),
    ...getDemocracyReferendumOptionValues(),
  };

  const saveOnchainOptions = useMemo(
    () =>
      debounce(async (onchainOptionValues) => {
        nextApi
          .patch("user/subscription", onchainOptionValues)
          .then(({ error }) => {
            if (error) {
              dispatch(newErrorToast(error.message));
            }
          });
      }, 1000),
    [dispatch],
  );

  useDeepCompareEffect(() => {
    if (!canSave) {
      return;
    }
    saveOnchainOptions(onchainOptionValues);
  }, [saveOnchainOptions, canSave, onchainOptionValues]);

  return (
    <>
      <AccordionCard title="Treasury" defaultOpen={true}>
        <Options>{treasuryProposalOptionsComponent}</Options>
      </AccordionCard>
      <AccordionCard title="Tech-Comm." defaultOpen={true}>
        <Options>{techCommMotionOptionsComponent}</Options>
      </AccordionCard>
      <AccordionCard title="Democracy" defaultOpen={true}>
        <Options>
          {democracyProposalOptionsComponent}
          {democracyReferendumOptionsComponent}
        </Options>
      </AccordionCard>
    </>
  );
}

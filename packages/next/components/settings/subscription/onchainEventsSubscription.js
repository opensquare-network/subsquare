import { useMemo } from "react";
import nextApi from "next-common/services/nextApi";
import useAdvisoryCommitteeSubscription from "components/settings/subscription/useAdvisoryCommitteeSubscription";
import useOpenGovSubscription from "components/settings/subscription/useOpenGovSubscription";
import useTreasurySubscription from "components/settings/subscription/useTreasurySubscription";
import useDemocracySubscription from "components/settings/subscription/useDemocracySubscription";
import useCouncilSubscription from "components/settings/subscription/useCouncilSubscription";
import useTechCommSubscription from "components/settings/subscription/useTechCommSubscription";
import { useUser } from "next-common/context/user";
import debounce from "lodash.debounce";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import useDeepCompareEffect from "use-deep-compare-effect";
import { usePageProps } from "next-common/context/page";

export default function OnChainEventsSubscription() {
  const dispatch = useDispatch();
  const loginUser = useUser();
  const { subscription } = usePageProps();

  const isVerifiedUser = loginUser?.emailVerified;
  const telegramLinked = loginUser?.telegram?.chat;
  const disabled = !isVerifiedUser && !telegramLinked;

  const { treasuryOptions, isTreasuryOptionsChanged, getTreasuryOptionValues } =
    useTreasurySubscription(subscription, disabled);

  const { councilOptions, isCouncilOptionsChanged, getCouncilOptionValues } =
    useCouncilSubscription(subscription, disabled);

  const { techCommOptions, isTechCommOptionsChanged, getTechCommOptionValues } =
    useTechCommSubscription(subscription, disabled);

  const {
    democracyOptions,
    isDemocracyOptionsChanged,
    getDemocracyOptionValues,
  } = useDemocracySubscription(subscription, disabled);

  const { openGovOptions, isOpenGovOptionsChanged, getOpenGovOptionValues } =
    useOpenGovSubscription(subscription, disabled);

  const {
    advisoryOptions,
    isAdvisoryCommitteeOptionsChanged,
    getAdvisoryCommitteeOptionValues,
  } = useAdvisoryCommitteeSubscription(subscription, disabled);

  const canSave =
    !disabled &&
    (isTreasuryOptionsChanged ||
      isCouncilOptionsChanged ||
      isTechCommOptionsChanged ||
      isDemocracyOptionsChanged ||
      isOpenGovOptionsChanged ||
      isAdvisoryCommitteeOptionsChanged);

  const onchainOptionValues = {
    ...getTechCommOptionValues(),
    ...getCouncilOptionValues(),
    ...getDemocracyOptionValues(),
    ...getTreasuryOptionValues(),
    ...getOpenGovOptionValues(),
    ...getAdvisoryCommitteeOptionValues(),
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
      {openGovOptions}
      {treasuryOptions}
      {councilOptions}
      {techCommOptions}
      {advisoryOptions}
      {democracyOptions}
    </>
  );
}

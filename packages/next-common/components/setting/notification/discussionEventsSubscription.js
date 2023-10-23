import debounce from "lodash.debounce";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useDiscussionOptions from "./useDiscussionOptions";
import { useUser } from "next-common/context/user";
import useDeepCompareEffect from "use-deep-compare-effect";
import { Options } from "./styled";
import AccordionCard from "next-common/components/styled/containers/accordionCard";

export default function DiscussionEventsSubscription() {
  const dispatch = useDispatch();
  const loginUser = useUser();

  const isVerifiedUser = loginUser?.emailVerified;
  const telegramLinked = loginUser?.telegram?.chat;
  const disabled = !isVerifiedUser && !telegramLinked;

  const {
    discussionOptionsComponent,
    getDiscussionOptionValues,
    isChanged: isNotificationChanged,
  } = useDiscussionOptions({
    disabled,
    reply: !!loginUser?.notification?.reply,
    mention: !!loginUser?.notification?.mention,
  });

  const saveDiscussionOptions = useCallback(
    debounce(async (discussionOptionValues) => {
      nextApi
        .patch("user/notification", discussionOptionValues)
        .then(({ error }) => {
          if (error) {
            dispatch(newErrorToast(error.message));
          }
        });
    }, 1000),
    [dispatch],
  );

  const discussionOptionValues = getDiscussionOptionValues();

  useDeepCompareEffect(() => {
    if (!isNotificationChanged) {
      return;
    }
    saveDiscussionOptions(discussionOptionValues);
  }, [saveDiscussionOptions, isNotificationChanged, discussionOptionValues]);

  return (
    <AccordionCard title="Discussions" defaultOpen={true}>
      <Options>{discussionOptionsComponent}</Options>
    </AccordionCard>
  );
}

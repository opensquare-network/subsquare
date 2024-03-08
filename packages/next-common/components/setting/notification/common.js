import { debounce } from "lodash-es";
import { useUser } from "next-common/context/user";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import useDeepCompareEffect from "use-deep-compare-effect";

export function useDebounceAutoSaveOnChainOptions(
  isChanged,
  onchainOptionValues,
) {
  const dispatch = useDispatch();

  const saveOnchainOptions = useMemo(
    () =>
      debounce(async (onchainOptionValues) => {
        nextApi
          .patch("user/subscription", onchainOptionValues)
          .then(({ error }) => {
            if (error) {
              dispatch(newErrorToast(error.message));
              return;
            }
            dispatch(newSuccessToast("Settings saved", 1000));
          });
      }, 1000),
    [dispatch],
  );

  useDeepCompareEffect(() => {
    if (!isChanged) {
      return;
    }
    saveOnchainOptions(onchainOptionValues);
  }, [saveOnchainOptions, isChanged, onchainOptionValues]);
}

export function useDebounceAutoSaveDiscussionOptions(
  isChanged,
  discussionOptionValues,
) {
  const dispatch = useDispatch();

  const saveDiscussionOptions = useMemo(
    () =>
      debounce(async (discussionOptionValues) => {
        nextApi
          .patch("user/notification", discussionOptionValues)
          .then(({ error }) => {
            if (error) {
              dispatch(newErrorToast(error.message));
              return;
            }
            dispatch(newSuccessToast("Settings saved", 1000));
          });
      }, 1000),
    [dispatch],
  );

  useDeepCompareEffect(() => {
    if (!isChanged) {
      return;
    }
    saveDiscussionOptions(discussionOptionValues);
  }, [saveDiscussionOptions, isChanged, discussionOptionValues]);
}

export function useDebounceAutoSaveActiveChannelOptions(
  isChanged,
  activeChannelOptionValues,
) {
  const dispatch = useDispatch();

  const saveActiveChannelOptions = useMemo(
    () =>
      debounce(async (activeChannelOptionValues) => {
        nextApi
          .patch("user/active-notification-channels", activeChannelOptionValues)
          .then(({ error }) => {
            if (error) {
              dispatch(newErrorToast(error.message));
              return;
            }
            dispatch(newSuccessToast("Settings saved", 1000));
          });
      }, 1000),
    [dispatch],
  );

  useDeepCompareEffect(() => {
    if (!isChanged) {
      return;
    }
    saveActiveChannelOptions(activeChannelOptionValues);
  }, [saveActiveChannelOptions, isChanged, activeChannelOptionValues]);
}

export function useIsDiscussionOptionsDisabled() {
  const user = useUser();
  return !user?.emailVerified;
}

export function useIsOnChainOptionsDisabled() {
  const user = useUser();

  const isVerifiedUser = user?.emailVerified;
  const telegramLinked = user?.telegram?.chat;
  return !isVerifiedUser && !telegramLinked;
}

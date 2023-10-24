import debounce from "lodash.debounce";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
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
            }
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
            }
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

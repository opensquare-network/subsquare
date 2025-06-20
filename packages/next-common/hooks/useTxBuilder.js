import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

export function useTxBuilder(builder, deps = []) {
  const dispatch = useDispatch();

  const buildTx = useCallback(
    (options = {}) => {
      const { showError = false } = options;

      const toastError = (message) => {
        if (showError) {
          dispatch(newErrorToast(message));
        }
      };

      return builder(toastError);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, ...deps],
  );

  const getTxFuncForSubmit = useCallback(
    () => buildTx({ showError: true }),
    [buildTx],
  );

  const getTxFuncForFee = useCallback(
    () => buildTx({ showError: false }),
    [buildTx],
  );

  return {
    getTxFuncForSubmit,
    getTxFuncForFee,
  };
}

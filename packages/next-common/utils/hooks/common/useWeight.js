import useApi from "../useApi";
import useIsMounted from "../useIsMounted";
import { useEffect, useState } from "react";
import { BN_ZERO, isFunction, nextTick, objectSpread } from "@polkadot/util";

// this is 32 bytes in length, it allows construction for both AccountId32 & AccountId20
export const ZERO_ACCOUNT = "0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef";

const EMPTY_STATE = {
  encodedCallLength: 0,
  v1Weight: BN_ZERO,
  v2Weight: { refTime: BN_ZERO },
  weight: BN_ZERO,
};

// return both v1 & v2 weight structures (would depend on actual use)
export function convertWeight (weight) {
  if (weight.proofSize) {
    // V2 weight
    const refTime = weight.refTime.toBn();

    return { v1Weight: refTime, v2Weight: weight };
  } else if (weight.refTime) {
    // V1.5 weight (when not converted)
    const refTime = weight.refTime.toBn();

    return { v1Weight: refTime, v2Weight: { refTime } };
  }

  // V1 weight
  const refTime = weight.toBn();
  return { v1Weight: refTime, v2Weight: { refTime } };
}

export default function useWeight(call) {
  const api = useApi();
  const isMounted = useIsMounted();
  const [state, setState] = useState(() => objectSpread({
    isWeightV2: !isFunction(api?.registry.createType("Weight").toBn),
  }, EMPTY_STATE));

  useEffect(() => {
    if (!api || !call || !api?.call?.transactionPaymentApi) {
      setState((prev) =>
        objectSpread({}, prev, EMPTY_STATE),
      );
      return;
    }

    nextTick(async () => {
      try {
        const { v1Weight, v2Weight } = convertWeight(
          (await api.tx(call).paymentInfo(ZERO_ACCOUNT)).weight,
        );

        isMounted.current && setState((prev) =>
          objectSpread({}, prev, {
            encodedCallLength: call.encodedLength,
            v1Weight,
            v2Weight,
            weight: prev.isWeightV2
              ? v2Weight
              : v1Weight,
          }),
        );
      } catch (error) {
        console.error(error);
      }
    });
  }, [api, call, isMounted]);

  return state;
}

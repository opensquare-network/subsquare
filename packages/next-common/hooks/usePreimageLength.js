import { isValidPreimageHash } from "next-common/utils";
import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function usePreimageLength(preimageHash) {
  const api = useContextApi();
  const [preimageLength, setPreimageLength] = useState();

  useEffect(() => {
    if (!preimageHash || !isValidPreimageHash(preimageHash) || !api) {
      return;
    }

    Promise.all([
      api.query.preimage.statusFor?.(preimageHash),
      api.query.preimage.requestStatusFor?.(preimageHash),
    ]).then(([statusFor, requestStatusFor]) => {
      const status =
        statusFor?.unwrapOr(null) || requestStatusFor?.unwrapOr(null);
      if (!status) {
        return;
      }
      setPreimageLength(status.value?.len?.toString());
    });
  }, [api, preimageHash]);

  return preimageLength;
}

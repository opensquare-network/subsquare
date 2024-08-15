import toApiCouncil from "next-common/utils/toApiCouncil";
import SignerPopupV2 from "next-common/components/signerPopup/indexV2";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";

export default function CloseMotionPopup({
  chain,
  type,
  hash,
  motionIndex,
  weight,
  encodedCallLength,
  hasFailed,
  onClose,
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    const closeMethod = api?.tx?.[toApiCouncil(chain, type)]?.close;
    if (!closeMethod) {
      return;
    }

    let tx;
    if (closeMethod.meta?.args?.length !== 4) {
      tx = closeMethod(hash, motionIndex);
    } else if (hasFailed) {
      tx = closeMethod(hash, motionIndex, 0, 0);
    } else {
      tx = closeMethod(hash, motionIndex, weight, encodedCallLength);
    }
    return tx;
  }, [
    api,
    chain,
    type,
    hash,
    motionIndex,
    weight,
    encodedCallLength,
    hasFailed,
  ]);

  return (
    <SignerPopupV2
      title="Close Motion"
      getTxFunc={getTxFunc}
      onClose={onClose}
    />
  );
}

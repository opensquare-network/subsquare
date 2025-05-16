import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";
import { useCollectivePallet } from "next-common/context/collective";

export default function CloseMotionPopup({
  hash,
  motionIndex,
  weight,
  encodedCallLength,
  hasFailed,
  onClose,
}) {
  const api = useContextApi();
  const pallet = useCollectivePallet();

  const getTxFunc = useCallback(async () => {
    const closeMethod = api?.tx?.[pallet]?.close;
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
  }, [api, pallet, hash, motionIndex, weight, encodedCallLength, hasFailed]);

  return (
    <SimpleTxPopup
      title="Close Motion"
      getTxFunc={getTxFunc}
      onClose={onClose}
    />
  );
}

import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import { isNil } from "lodash-es";
import { useNewReferendumTx } from "./useNewReferendumTx";

export function usePreimageExists({ encodedHash }) {
  const { hashes: preimages } = useCombinedPreimageHashes();
  return useMemo(() => {
    if (isNil(encodedHash) || !preimages) {
      return false;
    }
    return preimages.some(({ data: [hash] }) => hash === encodedHash);
  }, [preimages, encodedHash]);
}

export default function useNewReferendumCells({
  notePreimageTx,
  trackId,
  encodedHash,
  encodedLength,
  enactment,
  preimageExists,
}) {
  const submitReferendaTx = useNewReferendumTx({
    trackId,
    encodedHash,
    encodedLength,
    enactment,
  });

  const dispatch = useDispatch();

  const cells = useMemo(() => {
    const cells = [];
    if (notePreimageTx) {
      cells.push({
        getTxFunc: () => notePreimageTx,
        onInBlock: () => {
          dispatch(newSuccessToast("Preimage created"));
          dispatch(incPreImagesTrigger());
        },
        preimageExists,
        label: "Signing to create a preimage",
      });
    }

    cells.push(submitReferendaTx);
    return cells;
  }, [submitReferendaTx, notePreimageTx, dispatch, preimageExists]);

  return {
    cells,
  };
}

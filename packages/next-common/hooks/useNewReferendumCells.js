import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useReferendaProposalOrigin } from "next-common/components/summary/newProposalPopup";
import { useContextApi } from "next-common/context/api";
import { useListPageType } from "next-common/context/page";
import { usePopupOnClose } from "next-common/context/popup";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import { isNil } from "lodash-es";

export function usePreimageExists({ encodedHash }) {
  const { hashes: preimages } = useCombinedPreimageHashes();
  return useMemo(() => {
    if (isNil(encodedHash) || !preimages) {
      return false;
    }
    return preimages.some(({ data: [hash] }) => hash === encodedHash);
  }, [preimages, encodedHash]);
}

export function useNewReferendumTx({
  trackId,
  encodedHash,
  encodedLength,
  enactment,
}) {
  const listPageType = useListPageType();

  let pallet = "referenda";
  let referendaUrl = "/referenda";
  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    pallet = "fellowshipReferenda";
    referendaUrl = "/fellowship/referenda";
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    pallet = "ambassadorReferenda";
    referendaUrl = "/ambassador/referenda";
  }

  const closeNewReferendumPopup = usePopupOnClose();
  const router = useRouter();
  const api = useContextApi();
  const proposalOrigin = useReferendaProposalOrigin(trackId);

  const getSubmitReferendaTx = useCallback(() => {
    if (!api || !encodedHash) {
      return;
    }

    return api.tx[pallet].submit(
      proposalOrigin,
      {
        Lookup: {
          hash: encodedHash,
          len: encodedLength,
        },
      },
      enactment,
    );
  }, [api, encodedHash, encodedLength, enactment, pallet, proposalOrigin]);

  return {
    getTxFunc: getSubmitReferendaTx,
    onInBlock: ({ events }) => {
      const eventData = getEventData(events, pallet, "Submitted");
      if (!eventData) {
        return;
      }
      const [referendumIndex] = eventData;
      router.push(`${referendaUrl}/${referendumIndex}`);
    },
    onSubmitted: () => {
      closeNewReferendumPopup?.();
    },
    label: "Signing to submit a OpenGov referendum",
  };
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

export function useNewReferendumButton({
  disabled,
  buttonText = "Submit",
  trackId,
  encodedHash,
  encodedLength,
  enactment,
}) {
  const { getTxFunc, onInBlock, onSubmitted } = useNewReferendumTx({
    trackId,
    encodedHash,
    encodedLength,
    enactment,
  });
  const { isSubmitting, doSubmit } = useTxSubmission({
    getTxFunc,
    onInBlock: () => {
      onInBlock?.();
    },
    onSubmitted,
  });

  return {
    isSubmitting,
    getTxFunc,
    onInBlock,
    doSubmit,
    component: (
      <LoadingPrimaryButton
        disabled={disabled}
        loading={isSubmitting}
        onClick={doSubmit}
      >
        {buttonText}
      </LoadingPrimaryButton>
    ),
  };
}

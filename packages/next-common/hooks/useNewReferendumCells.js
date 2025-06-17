import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useReferendaProposalOrigin } from "next-common/components/summary/newProposalPopup";
import { useContextApi } from "next-common/context/api";
import { useListPageType } from "next-common/context/page";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

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
    if (preimageExists) {
      cells.push({
        getTxFunc: () => notePreimageTx,
        onInBlock: () => {
          dispatch(newSuccessToast("Preimage created"));
          dispatch(incPreImagesTrigger());
        },
        label: "Signing to create a preimage",
      });
    }

    cells.push(submitReferendaTx);
    return cells;
  }, [preimageExists, submitReferendaTx, notePreimageTx, dispatch]);

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
  const { getTxFunc, onInBlock } = useNewReferendumTx({
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
  });

  return {
    isSubmitting,
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

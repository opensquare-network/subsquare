import { useReferendaProposalOrigin } from "next-common/components/summary/newProposalPopup";
import { useContextApi } from "next-common/context/api";
import { useListPageType } from "next-common/context/page";
// import { usePopupOnClose } from "next-common/context/popup";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useCombinedPreimageHashes } from "./usePreimageHashes";
import { useCallback, useMemo, useState } from "react";
import { isNil } from "lodash-es";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { getEventData } from "next-common/utils/sendTransaction";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";

export function usePreimageExists({ encodedHash }) {
  const { hashes: preimages } = useCombinedPreimageHashes();
  const preimageExists = useMemo(() => {
    if (isNil(encodedHash) || !preimages) {
      return false;
    }
    return preimages.some(({ data: [hash] }) => hash === encodedHash);
  }, [preimages, encodedHash]);

  return preimageExists;
}

export default function useCreateProposalSubmit({
  trackId,
  enactment,
  encodedHash,
  encodedLength,
  notePreimageTx,
  preimageExists,
}) {
  const list = [];

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

  // const onClose = usePopupOnClose();
  const router = useRouter();
  const dispatch = useDispatch();
  const api = useContextApi();
  const proposalOrigin = useReferendaProposalOrigin(trackId);

  const getSubmitReferendaTx = () => {
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
  };

  const {
    isSubmitting: isReferendaTxSubmitting,
    doSubmit: submitReferendaTx,
    isOnBlock: isReferendaTxOnBlock,
  } = useTxSubmissionBlockSuccess({
    getTxFunc: getSubmitReferendaTx,
    onInBlock: ({ events }) => {
      const eventData = getEventData(events, pallet, "Submitted");
      if (!eventData) {
        return;
      }
      const [referendumIndex] = eventData;
      router.push(`${referendaUrl}/${referendumIndex}`);
    },
    // onSubmitted: onClose,
  });

  const {
    isSubmitting: isPreimageTxSubmitting,
    doSubmit: submitPreimageTx,
    isOnBlock: isPreimageTxOnBlock,
  } = useTxSubmissionBlockSuccess({
    getTxFunc: () => notePreimageTx,
    onInBlock: () => {
      dispatch(newSuccessToast("Preimage created"));
      dispatch(incPreImagesTrigger());
      submitReferendaTx();
    },
  });

  if (preimageExists) {
    list.push({
      id: "preimage",
      label: "Signing to create a preimage",
      isLoading: isPreimageTxSubmitting,
      isOnBlock: isPreimageTxOnBlock,
      doSubmit: submitPreimageTx,
    });
  }

  list.push({
    id: "referenda",
    label: "Signing to submit a OpenGov referendum",
    isLoading: isReferendaTxSubmitting,
    isOnBlock: isReferendaTxOnBlock,
    doSubmit: submitReferendaTx,
  });

  return list;
}

export function useTxSubmissionBlockSuccess({ getTxFunc, onInBlock }) {
  const [isOnBlock, setIsOnBlock] = useState(false);

  const { isSubmitting, doSubmit: doSubmitTx } = useTxSubmission({
    getTxFunc,
    onInBlock: () => {
      setIsOnBlock(true);
      onInBlock();
    },
  });

  const doSubmit = useCallback(async () => {
    await doSubmitTx();
    return isOnBlock;
  }, [doSubmitTx, isOnBlock]);

  return {
    isSubmitting,
    isOnBlock,
    doSubmit,
  };
}

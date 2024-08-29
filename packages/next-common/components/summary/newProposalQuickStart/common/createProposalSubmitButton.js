import { useMemo } from "react";
import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { getEventData } from "next-common/utils/sendTransaction";
import { useDispatch } from "react-redux";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { useReferendaProposalOrigin } from "../../newProposalPopup";
import { useRouter } from "next/router";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";
import { usePopupOnClose } from "next-common/context/popup";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";

export default function CreateProposalSubmitButton({
  trackId,
  enactment,
  encodedHash,
  encodedLength,
  notePreimageTx,
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

  const onClose = usePopupOnClose();
  const router = useRouter();
  const dispatch = useDispatch();
  const api = useContextApi();
  const proposalOrigin = useReferendaProposalOrigin(trackId);

  const preimages = useCombinedPreimageHashes();
  const preimageExists = useMemo(() => {
    if (isNil(encodedHash) || !preimages) {
      return false;
    }
    return preimages.some(({ data: [hash] }) => hash === encodedHash);
  }, [preimages, encodedHash]);

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

  const { isSubmitting: isReferendaTxSubmitting, doSubmit: submitReferendaTx } =
    useTxSubmission({
      getTxFunc: getSubmitReferendaTx,
      onInBlock: (events) => {
        const eventData = getEventData(events, pallet, "Submitted");
        if (!eventData) {
          return;
        }
        const [referendumIndex] = eventData;
        router.push(`${referendaUrl}/${referendumIndex}`);
      },
      onSubmitted: onClose,
    });

  const { isSubmitting: isPreimageTxSubmitting, doSubmit: submitPreimageTx } =
    useTxSubmission({
      getTxFunc: () => notePreimageTx,
      onInBlock: () => {
        dispatch(newSuccessToast("Preimage created"));
        dispatch(incPreImagesTrigger());
        submitReferendaTx();
      },
    });

  const isLoading = isPreimageTxSubmitting || isReferendaTxSubmitting;

  if (preimageExists) {
    return (
      <LoadingPrimaryButton loading={isLoading} onClick={submitReferendaTx}>
        Submit Proposal
      </LoadingPrimaryButton>
    );
  } else {
    return (
      <LoadingPrimaryButton
        loading={isLoading}
        disabled={!notePreimageTx}
        onClick={submitPreimageTx}
      >
        Create Preimage
      </LoadingPrimaryButton>
    );
  }
}

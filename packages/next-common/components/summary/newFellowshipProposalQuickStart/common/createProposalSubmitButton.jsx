import { isNil } from "lodash-es";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useContextApi } from "next-common/context/api";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { usePopupOnClose } from "next-common/context/popup";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { getEventData } from "next-common/utils/sendTx";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useFellowshipProposalOrigin } from "../../newFellowshipProposalPopup";

export default function CreateFellowshipProposalSubmitButton({
  trackId,
  enactment,
  encodedHash,
  encodedLength,
  notePreimageTx,
}) {
  const { section } = useCollectivesContext();

  let pallet;
  if (section === "fellowship") {
    pallet = "fellowshipReferenda";
  } else if (section === "ambassador") {
    pallet = "ambassadorReferenda";
  }

  const onClose = usePopupOnClose();
  const router = useRouter();
  const dispatch = useDispatch();
  const api = useContextApi();
  const proposalOrigin = useFellowshipProposalOrigin(trackId);

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

    if (!proposalOrigin) {
      dispatch(newErrorToast("Proposal origin is not set correctly"));
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
        const eventData = getEventData(events, "referenda", "Submitted");
        if (!eventData) {
          return;
        }
        const [referendumIndex] = eventData;
        router.push(`/${section}/referenda/${referendumIndex}`);
      },
      onClose,
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

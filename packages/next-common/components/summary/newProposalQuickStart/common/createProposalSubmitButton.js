import { useMemo } from "react";
import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { getEventData } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { upperFirstCamelCase } from "next-common/utils";
import { useProposalOrigin } from "../../newProposalPopup";
import { useRouter } from "next/router";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";
import useTrackDetail from "../../newProposalPopup/useTrackDetail";
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
  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    pallet = "fellowshipReferenda";
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    pallet = "ambassadorReferenda";
  }

  const onClose = usePopupOnClose();
  const router = useRouter();
  const dispatch = useDispatch();
  const api = useContextApi();
  const track = useTrackDetail(trackId);
  const proposalOrigin = useProposalOrigin(trackId);

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

    let proposalOriginValue = proposalOrigin;

    // When proposal origin is not defined in track detail, we use the track name as origin
    if (!proposalOriginValue) {
      if (track?.name === "root") {
        proposalOriginValue = { system: "Root" };
      } else {
        proposalOriginValue = { Origins: upperFirstCamelCase(track?.name) };
      }
    }

    return api.tx[pallet].submit(
      proposalOriginValue,
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
        router.push(`/${listPageType}/${referendumIndex}`);
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

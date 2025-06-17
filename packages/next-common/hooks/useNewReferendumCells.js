import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import { isNil } from "lodash-es";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { usePopupOnClose } from "next-common/context/popup";
import { useRouter } from "next/router";
import { useContextApi } from "next-common/context/api";
import { useReferendaProposalOrigin } from "next-common/components/summary/newProposalPopup";
import { getEventData } from "next-common/utils/sendTransaction";

export default function useNewReferendumCells({
  notePreimageTx,
  trackId,
  encodedHash,
  encodedLength,
  enactment,
  preimageExists,
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

  const dispatch = useDispatch();

  const cells = useMemo(() => {
    return [
      {
        getTxFunc: () => notePreimageTx,
        onInBlock: () => {
          dispatch(newSuccessToast("Preimage created"));
          dispatch(incPreImagesTrigger());
        },
        preimageExists,
        label: "Signing to create a preimage",
      },
      {
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
      },
    ];
  }, [
    preimageExists,
    getSubmitReferendaTx,
    notePreimageTx,
    dispatch,
    pallet,
    router,
    referendaUrl,
    closeNewReferendumPopup,
  ]);

  return {
    cells,
  };
}

export function usePreimageExists({ encodedHash }) {
  const { hashes: preimages } = useCombinedPreimageHashes();
  return useMemo(() => {
    if (isNil(encodedHash) || !preimages) {
      return false;
    }
    return preimages.some(({ data: [hash] }) => hash === encodedHash);
  }, [preimages, encodedHash]);
}

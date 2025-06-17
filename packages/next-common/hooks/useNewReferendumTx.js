import { useCallback } from "react";
import { useListPageType } from "next-common/hooks/useListPageType";
import { usePopupOnClose } from "next-common/hooks/usePopupOnClose";
import { useRouter } from "next/router";
import { useContextApi } from "next-common/contexts/Context";
import { useReferendaProposalOrigin } from "next-common/hooks/useReferendaProposalOrigin";
import { getEventData } from "next-common/lib/utils/getEventData";
import { listPageCategory } from "next-common/utils/consts/business/category";

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

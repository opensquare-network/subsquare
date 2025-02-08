import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { useCallback } from "react";

function IconButton({ icon, onClick }) {
  return (
    <div
      role="button"
      className="p-[6px] rounded-[4px] border border-neutral400 hover:border-neutral500"
      onClick={onClick}
    >
      {icon}
    </div>
  );
}

export function AyeButton({ onClick }) {
  return (
    <IconButton
      icon={<SystemVoteAye className="w-[16px] h-[16px]" />}
      onClick={onClick}
    />
  );
}

export function NayButton({ onClick }) {
  return (
    <IconButton
      icon={<SystemVoteNay className="w-[16px] h-[16px]" />}
      onClick={onClick}
    />
  );
}

export function VoteButtons({ referendumIndex }) {
  const api = useContextApi();
  const collectivePallet = useRankedCollectivePallet();
  const getTxFunc = useCallback(
    (aye) => {
      if (!api || isNil(referendumIndex)) {
        return;
      }
      return api.tx[collectivePallet].vote(referendumIndex, aye);
    },
    [api, collectivePallet, referendumIndex],
  );

  const { doSubmit: doSubmitAye, isSubmitting: isSubmittingAye } =
    useTxSubmission({
      getTxFunc: () => getTxFunc(true),
    });

  const { doSubmit: doSubmitNay, isSubmitting: isSubmittingNay } =
    useTxSubmission({
      getTxFunc: () => getTxFunc(false),
    });

  const isSubmitting = isSubmittingAye || isSubmittingNay;

  return (
    <SignerPopupWrapper>
      <AyeButton disabled={isSubmitting} onClick={doSubmitAye} />
      <NayButton disabled={isSubmitting} onClick={doSubmitNay} />
    </SignerPopupWrapper>
  );
}

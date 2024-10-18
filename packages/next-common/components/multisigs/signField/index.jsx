import Tooltip from "next-common/components/tooltip";
import { SystemVoteAbstain, SystemVoteAye } from "@osn/icons/subsquare";
import { isSameAddress } from "next-common/utils";
import { usePathname } from "next/navigation";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";
import SignApprove from "./signApprove";
import SignCancel from "./signCancel";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignSubmit from "./signSubmit";

function ApprovedTooltip() {
  return (
    <Tooltip content="You approved this multisig">
      <span className="inline-flex p-1.5">
        <SystemVoteAye className="w-4 h-4" />
      </span>
    </Tooltip>
  );
}

function NotApprovedTooltip() {
  return (
    <Tooltip content="You didn't sign this multisig">
      <span className="inline-flex p-1.5">
        <SystemVoteAbstain className="w-4 h-4" />
      </span>
    </Tooltip>
  );
}

export default function MultisigSignField({ multisig = {} }) {
  const { approvals, state, signatories, threshold, depositor } = multisig;
  const pathname = usePathname();
  const profileAddress = useProfileAddress();
  const realAddress = useRealAddress();

  const commonCheck = useMemo(() => {
    const isSignatory = signatories?.includes(realAddress);
    const hasNotApproved = !approvals?.some((item) =>
      isSameAddress(item, realAddress),
    );
    const isApproving = state?.name === "Approving";
    return { isSignatory, hasNotApproved, isApproving };
  }, [approvals, realAddress, signatories, state?.name]);

  const isNeedSelfApprove = useMemo(() => {
    const { isSignatory, hasNotApproved, isApproving } = commonCheck;
    if (!approvals || !signatories || !isApproving || !realAddress) {
      return false;
    }

    const isNeedSign = approvals.length < threshold;
    return isSignatory && hasNotApproved && isNeedSign;
  }, [approvals, realAddress, signatories, threshold, state?.name]);

  const isCanbeCanceled = useMemo(() => {
    const { isSignatory, isApproving } = commonCheck;
    if (!approvals || !signatories || !isApproving || !realAddress) {
      return false;
    }

    const isDepositor = depositor === realAddress;
    return isSignatory && isDepositor;
  }, [approvals, realAddress, signatories, state?.name, depositor]);

  // call as_multi (Sign & Submit)
  const isNeedFinalApproval = useMemo(() => {
    const { isSignatory, hasNotApproved, isApproving } = commonCheck;
    if (!approvals || !signatories || !isApproving || !realAddress) {
      return false;
    }

    return isSignatory && hasNotApproved && approvals.length === threshold - 1;
  }, [approvals, realAddress, signatories, state?.name, threshold]);

  // call as_multi (Submit)
  const isReadyForSubmission = useMemo(() => {
    const { isSignatory, hasNotApproved, isApproving } = commonCheck;
    if (!approvals || !signatories || !isApproving || !realAddress) {
      return false;
    }

    const isAllApproved =
      isSignatory && hasNotApproved && approvals.length === threshold;

    return isAllApproved;
  }, [approvals, realAddress, signatories, state?.name, threshold]);

  const isApproved = useMemo(() => {
    if (pathname.startsWith("/user/")) {
      // on user profile multisigs page
      return approvals?.some((item) => isSameAddress(item, profileAddress));
    }

    return approvals?.some((item) => isSameAddress(item, realAddress));
  }, [approvals, pathname, profileAddress, realAddress]);

  let content = isApproved ? <ApprovedTooltip /> : <NotApprovedTooltip />;

  if (isNeedSelfApprove) {
    content = (
      <SignerPopupWrapper>
        <SignApprove multisig={multisig} />
      </SignerPopupWrapper>
    );
  }

  // SignCancel by depositor
  if (isCanbeCanceled) {
    content = (
      <SignerPopupWrapper>
        <SignCancel multisig={multisig} />
      </SignerPopupWrapper>
    );
  }

  // Sign & Submit
  if (isNeedFinalApproval || isReadyForSubmission) {
    content = (
      <SignerPopupWrapper>
        <SignSubmit multisig={multisig} />
      </SignerPopupWrapper>
    );
  }

  return <div className="flex items-center justify-end gap-x-2">{content}</div>;
}

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
  // const { approvals } = multisig;
  const pathname = usePathname();
  const profileAddress = useProfileAddress();
  const realAddress = useRealAddress();

  const isNeedSelfApprove = useMemo(() => {
    if (!approvals || !signatories || state?.name !== "Approving") {
      return false;
    }

    const hasNotApproved = !approvals.some((item) =>
      isSameAddress(item, realAddress),
    );
    const isSignatory = signatories.includes(realAddress);
    const isNeedSign = approvals.length < threshold;

    return isSignatory && hasNotApproved && isNeedSign;
  }, [approvals, realAddress, signatories, threshold, state?.name]);

  const isCanbeCanceled = useMemo(() => {
    if (!approvals || !signatories || state?.name !== "Approving") {
      return false;
    }

    const isSignatory = signatories.includes(realAddress);
    const isDepositor = depositor === realAddress;

    return isSignatory && isDepositor;
  }, [approvals, realAddress, signatories, state?.name, depositor]);

  // call as_multi (Sign & Submit)
  const isNeedFinalApproval = useMemo(() => {
    if (!approvals || !signatories || state?.name !== "Approving") {
      return false;
    }

    const isSignatory = signatories.includes(realAddress);
    const hasNotApproved = !approvals.some((item) =>
      isSameAddress(item, realAddress),
    );

    return isSignatory && hasNotApproved && approvals.length === threshold - 1;
  }, [approvals, realAddress, signatories, state?.name, threshold]);

  // call as_multi (Submit)
  const isReadyForSubmission = useMemo(() => {
    if (!approvals || !signatories || state?.name !== "Approving") {
      return false;
    }

    const isSignatory = signatories.includes(realAddress);
    const hasNotApproved = !approvals.some((item) =>
      isSameAddress(item, realAddress),
    );
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
    content = <SignApprove multisig={multisig} />;
  }

  // SignCancel by depositor
  if (isCanbeCanceled) {
    content = <SignCancel multisig={multisig} />;
  }

  // Sign & Submit
  if (isNeedFinalApproval || isReadyForSubmission) {
    content = <SignSubmit multisig={multisig} />;
  }

  return (
    <SignerPopupWrapper>
      <div className="flex items-center justify-end gap-x-2">{content}</div>
    </SignerPopupWrapper>
  );
}

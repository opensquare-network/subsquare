import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignCancel from "next-common/components/multisigs/signField/signCancel";
import SignSubmit from "next-common/components/multisigs/signField/signSubmit";
import SignApprove from "next-common/components/multisigs/signField/signApprove";
import { isSameAddress } from "next-common/utils";

function MultisigApprovingGuard({ state, children }) {
  if (state !== "Approving") {
    return null;
  }

  return children;
}

export default function SignatoryAction({ multisig = {} }) {
  const { approvals = [], state, signatories = [], threshold, depositor } = multisig || {};
  const realAddress = useRealAddress();
  const isSignatory = signatories.includes(realAddress);
  const isApproved = approvals.some((item) => isSameAddress(item, realAddress));
  const isDepositor = depositor === realAddress;
  if (!isSignatory || (isApproved && !isDepositor)) {
    return null;
  }

  const isDispatchable = approvals.length >= threshold - 1;

  return (
    <MultisigApprovingGuard state={state?.name}>
      <SignerPopupWrapper>
        {
          isDepositor ? <SignCancel multisig={multisig} /> :
            isDispatchable ? <SignSubmit multisig={multisig} /> :
              <SignApprove multisig={multisig} />
        }
      </SignerPopupWrapper>
    </MultisigApprovingGuard>
  )
}

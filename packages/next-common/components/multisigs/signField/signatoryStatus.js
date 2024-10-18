import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { ApprovedTooltip, NotApprovedTooltip } from "next-common/components/multisigs/signField/tooltips";

export default function SignatoryStatus({ multisig }) {
  const realAddress = useRealAddress();
  const { approvals = [], state, depositor } = multisig || {};
  const isApproved = approvals.some((item) => isSameAddress(item, realAddress));
  const isMultisigFinished = state?.name !== "Approving"; // state is Executed or Cancelled
  const isDepositor = depositor === realAddress;

  if (isMultisigFinished || (!isDepositor && isApproved)) {
    return isApproved ? <ApprovedTooltip /> : <NotApprovedTooltip />;
  }

  return null;
}

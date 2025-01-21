import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isAddressInGroup, isSameAddress } from "next-common/utils";
import {
  ApprovedTooltip,
  NotApprovedTooltip,
} from "next-common/components/multisigs/signField/tooltips";

export default function SignatoryStatus({ multisig }) {
  const realAddress = useRealAddress();
  const { approvals = [], state, depositor } = multisig || {};
  const isApproved = isAddressInGroup(realAddress, approvals);
  const isMultisigFinished = state?.name !== "Approving"; // state is Executed or Cancelled
  const isDepositor = isSameAddress(depositor, realAddress);

  if (isMultisigFinished || (!isDepositor && isApproved)) {
    return isApproved ? <ApprovedTooltip /> : <NotApprovedTooltip />;
  }

  return null;
}

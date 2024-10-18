import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";

export default function DepositorField({ multisig }) {
  const { approvals = [], state, depositor } = multisig || {};
  const realAddress = useRealAddress();
  const isDepositor = isSameAddress(depositor, realAddress);
  const isMultisigFinished = state?.name !== "Approving"; // state is Executed or Cancelled
  if (isDepositor) {
    return null;
  }

}

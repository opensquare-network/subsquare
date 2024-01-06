import { useOnchainData, usePostState } from "next-common/context/post";
import useCall from "next-common/utils/hooks/useCall";
import useApi from "next-common/utils/hooks/useApi";
import Malicious from "next-common/components/detail/malicious";
import { gov2State } from "next-common/utils/consts/state";

function Warning() {
  const { proposalHash } = useOnchainData();
  const api = useApi();
  const [status] = useCall(api?.query?.preimage?.statusFor, [proposalHash]);
  const [requestStatus] = useCall(api?.query?.preimage?.requestStatusFor, [
    proposalHash,
  ]);

  if (status && status.isEmpty && requestStatus && requestStatus.isEmpty) {
    return <Malicious>Preimage not found on chain</Malicious>;
  }

  return null;
}

export default function PreimageWarning() {
  const state = usePostState();
  const onchainData = useOnchainData();
  const { proposalHash, proposal, inlineCall } = onchainData;

  const inFinalState = [
    gov2State.Rejected,
    gov2State.Approved,
    gov2State.TimedOut,
    gov2State.Killed,
    gov2State.Cancelled,
    gov2State.Executed,
  ].includes(state);
  if (inFinalState || !proposalHash || proposal?.inline || inlineCall) {
    return null;
  }

  return <Warning />;
}

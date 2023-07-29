import { useOnchainData, usePostState } from "next-common/context/post";
import useCall from "next-common/utils/hooks/useCall";
import useApi from "next-common/utils/hooks/useApi";
import Malicious from "next-common/components/detail/malicious";
import { gov2State } from "next-common/utils/consts/state";

function Warning() {
  const { proposalHash } = useOnchainData();
  const api = useApi();
  let [status, isLoading] = useCall(api?.query?.preimage?.statusFor, [
    proposalHash,
  ]);
  if (isLoading || !status) {
    return null;
  }

  if (status.isEmpty) {
    return <Malicious>Preimage not found</Malicious>;
  }
}

export default function PreimageWarning() {
  const state = usePostState();
  if (
    [
      gov2State.Rejected,
      gov2State.TimedOut,
      gov2State.Killed,
      gov2State.Cancelled,
    ].includes(state)
  ) {
    return null;
  }

  return <Warning />;
}

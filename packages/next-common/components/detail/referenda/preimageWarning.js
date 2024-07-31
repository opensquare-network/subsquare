import { useOnchainData, usePostState } from "next-common/context/post";
import useCall from "next-common/utils/hooks/useCall";
import Malicious from "next-common/components/detail/malicious";
import { gov2State } from "next-common/utils/consts/state";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import {
  getLenFromOldRequestStatus,
  getLenFromRequestStatus,
} from "next-common/components/detail/common/preimage/len";

function Warning() {
  const { proposalHash, info } = useOnchainData();
  const api = useContextApi();
  const { value: status } = useCall(api?.query?.preimage?.statusFor, [
    proposalHash,
  ]);
  const { value: requestStatus } = useCall(
    api?.query?.preimage?.requestStatusFor,
    [proposalHash],
  );

  let lenFromStatus;
  if (requestStatus?.isSome) {
    lenFromStatus = getLenFromRequestStatus(requestStatus.unwrap());
  } else if (status?.isSome) {
    lenFromStatus = getLenFromOldRequestStatus(status.unwrap());
  }

  if (status?.isEmpty && requestStatus?.isEmpty) {
    return <Malicious>Preimage not found on chain</Malicious>;
  } else if (
    !isNil(lenFromStatus) &&
    info.proposal?.lookup &&
    info.proposal?.lookup?.len !== lenFromStatus
  ) {
    return <Malicious>Proposal len is invalid</Malicious>;
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

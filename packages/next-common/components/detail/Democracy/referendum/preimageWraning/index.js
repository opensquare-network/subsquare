import { useOnchainData, usePostState } from "next-common/context/post";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import Malicious from "next-common/components/detail/malicious";
import { isNil } from "lodash-es";
import {
  getLenFromOldRequestStatus,
  getLenFromRequestStatus,
} from "next-common/components/detail/common/preimage/len";

function Warning() {
  const { hash, meta, info, status: onChainStatus } = useOnchainData();
  const proposalHash = hash || meta?.proposalHash;
  const api = useContextApi();
  const { value: status } = useCall(api?.query?.preimage?.statusFor, [
    proposalHash,
  ]);
  const { value: requestStatus } = useCall(
    api?.query?.preimage?.requestStatusFor,
    [proposalHash],
  );
  const proposal = info?.ongoing?.proposal || onChainStatus?.proposal;

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
    proposal?.lookup &&
    proposal?.lookup?.len !== lenFromStatus
  ) {
    return <Malicious>Proposal len is invalid</Malicious>;
  }

  return null;
}

export default function DemocracyPreimageWarning() {
  const state = usePostState();
  if ("Started" !== state) {
    return null;
  }

  return <Warning />;
}

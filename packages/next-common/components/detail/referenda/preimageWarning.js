import { useOnchainData, usePostState } from "next-common/context/post";
import useCall from "next-common/utils/hooks/useCall";
import useApi from "next-common/utils/hooks/useApi";
import Malicious from "next-common/components/detail/malicious";
import { gov2State } from "next-common/utils/consts/state";
import { useChainSettings } from "next-common/context/chain";

function WarningCommon({ method }) {
  const { proposalHash } = useOnchainData();
  const api = useApi();
  let [status, isLoading] = useCall(api?.query?.preimage?.[method], [
    proposalHash,
  ]);
  if (isLoading || !status) {
    return null;
  }

  if (status.isEmpty) {
    return <Malicious>Preimage not found on chain</Malicious>;
  }
}

function OldWarning() {
  return <WarningCommon method="statusFor" />;
}

function Warning() {
  return <WarningCommon method="requestStatusFor" />;
}

export default function PreimageWarning() {
  const state = usePostState();
  const onchainData = useOnchainData();
  const { proposalHash, proposal, inlineCall } = onchainData;
  const { useNewPreimagePallet } = useChainSettings();

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

  if (!useNewPreimagePallet) {
    return <OldWarning />;
  }

  return <Warning />;
}

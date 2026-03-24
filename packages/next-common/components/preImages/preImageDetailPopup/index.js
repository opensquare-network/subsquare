import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import SecondaryButton from "next-common/lib/button/secondary";
import CallTreeView from "next-common/components/callTreeView";
import PapiCallTreeView from "next-common/components/papiCallTreeView";
import { useChainSettings } from "next-common/context/chain";

export default function PreimageDetailPopup({ proposal, setShow }) {
  const { enablePapi } = useChainSettings();

  return (
    <BaseVotesPopup title="Arguments" onClose={() => setShow(false)}>
      {enablePapi ? (
        <PapiCallTreeView proposal={proposal} />
      ) : (
        <CallTreeView proposal={proposal} />
      )}
      <div className="flex justify-end">
        <SecondaryButton onClick={() => setShow(false)}>Close</SecondaryButton>
      </div>
    </BaseVotesPopup>
  );
}

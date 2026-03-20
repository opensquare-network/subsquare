import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import SecondaryButton from "next-common/lib/button/secondary";
import CallTreeView from "next-common/components/callTreeView";
import PapiCallTreeView from "next-common/components/papiCallTreeView";

function isPapiCallTree(proposal) {
  return Array.isArray(proposal?.children) && !proposal?.meta;
}

export default function PreimageDetailPopup({ proposal, setShow }) {
  return (
    <BaseVotesPopup title="Arguments" onClose={() => setShow(false)}>
      {isPapiCallTree(proposal) ? (
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

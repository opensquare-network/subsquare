import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import GhostButton from "next-common/components/buttons/ghostButton";
import CallTreeView from "next-common/components/callTreeView";

export default function PreimageDetailPopup({ proposal, setShow }) {
  return (
    <BaseVotesPopup title="Arguments" onClose={() => setShow(false)}>
      <CallTreeView proposal={proposal} />
      <div className="flex justify-end">
        <GhostButton onClick={() => setShow(false)}>Close</GhostButton>
      </div>
    </BaseVotesPopup>
  );
}

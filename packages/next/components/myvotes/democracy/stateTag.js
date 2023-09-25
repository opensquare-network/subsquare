import { DemocracyReferendumTag } from "next-common/components/tags/state/democracy";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";

export default function DemocracyTag({ onchainData }) {
  if (!onchainData) {
    return null;
  }

  return (
    <DemocracyReferendumTag
      state={onchainData.state?.state}
      args={getDemocracyStateArgs(onchainData.state, onchainData.timeline)}
    />
  );
}

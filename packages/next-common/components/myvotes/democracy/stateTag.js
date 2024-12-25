import { DemocracyReferendumTag } from "next-common/components/tags/state/democracy";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";
import { capitalize } from "lodash-es";

export default function DemocracyTag({ post, onchainInfo }) {
  if (post) {
    const onchainData = post.onchainData;
    return (
      <DemocracyReferendumTag
        state={onchainData.state?.state}
        args={getDemocracyStateArgs(onchainData.state, onchainData.timeline)}
      />
    );
  } else if (onchainInfo) {
    return (
      <DemocracyReferendumTag
        state={capitalize(Object.keys(onchainInfo)[0])}
        args={Object.values(onchainInfo)[0]}
      />
    );
  }

  return null;
}

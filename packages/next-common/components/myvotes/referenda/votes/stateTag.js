import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import { capitalize } from "lodash-es";

export default function MyReferendaVoteTag({ post, onchainInfo }) {
  if (post) {
    const onchainData = post.onchainData;
    return (
      <Gov2ReferendaTag
        state={onchainData?.state?.name}
        args={getGov2ReferendumStateArgs(onchainData?.state)}
      />
    );
  } else if (onchainInfo) {
    return (
      <Gov2ReferendaTag
        state={capitalize(Object.keys(onchainInfo)[0])}
        args={Object.values(onchainInfo)[0]}
      />
    );
  }

  return null;
}

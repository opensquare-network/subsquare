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
    const [state, args] = Object.entries(onchainInfo || {})[0] || [];
    return <Gov2ReferendaTag state={capitalize(state)} args={args} />;
  }

  return null;
}

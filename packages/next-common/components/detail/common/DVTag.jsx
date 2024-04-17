import { includes } from "lodash-es";
import AddressDVTag from "next-common/components/user/dvTag";
import { useChain } from "next-common/context/chain";
import { usePost } from "next-common/context/post";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import getDvAddresses from "next-common/utils/dv";

export default function DVTag({ address, showTooltip }) {
  const post = usePost();
  const finishHeight = useReferendumVotingFinishHeight();
  const chain = useChain();
  const dvAddresses = getDvAddresses(chain, post.track, finishHeight);
  const isDV = includes(dvAddresses, address);

  if (isDV) {
    return <AddressDVTag showTooltip={showTooltip} />;
  }

  return null;
}

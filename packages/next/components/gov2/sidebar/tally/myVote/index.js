import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import MyVoteOnFinishedReferendum from "./history";
import MyVoteOnActiveReferendum from "./active";
import { usePost } from "next-common/context/post";
import MyReferendumVoteProvider from "next-common/context/referenda/myVote";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function MyVote() {
  const finishHeight = useReferendumVotingFinishHeight();
  const post = usePost();
  const trackId = post?.track;
  const address = useRealAddress();

  if (finishHeight) {
    return <MyVoteOnFinishedReferendum />;
  } else {
    return (
      <MyReferendumVoteProvider trackId={trackId} address={address}>
        <MyVoteOnActiveReferendum />
      </MyReferendumVoteProvider>
    );
  }
}

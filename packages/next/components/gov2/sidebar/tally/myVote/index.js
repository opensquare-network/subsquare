import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import MyVoteOnFinishedReferendum from "./history";
import { usePost } from "next-common/context/post";
import MyReferendumVoteProvider, {
  useSharedRemovePopupOpen,
} from "next-common/context/referenda/myVote";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import dynamicPopup from "next-common/lib/dynamic/popup";
import MyVoteOnActiveReferendum from "./info";

const RemoveReferendaVotePopup = dynamicPopup(() =>
  import("next-common/components/myReferendumVote/removeReferendaVotePopup"),
);

function MyVoteInner() {
  const finishHeight = useReferendumVotingFinishHeight();
  const [isRemovePopupOpen, setRemovePopupOpen] = useSharedRemovePopupOpen();
  const post = usePost();
  const trackId = post?.track;
  const referendumIndex = post?.referendumIndex;

  return (
    <>
      {finishHeight ? (
        <MyVoteOnFinishedReferendum />
      ) : (
        <MyVoteOnActiveReferendum />
      )}

      {isRemovePopupOpen && (
        <RemoveReferendaVotePopup
          trackId={trackId}
          referendumIndex={referendumIndex}
          onClose={() => setRemovePopupOpen(false)}
        />
      )}
    </>
  );
}

export default function MyVote() {
  const post = usePost();
  const trackId = post?.track;
  const address = useRealAddress();

  return (
    <MyReferendumVoteProvider trackId={trackId} address={address}>
      <MyVoteInner />
    </MyReferendumVoteProvider>
  );
}

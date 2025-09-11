import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import MyVoteOnFinishedReferendum from "./history";
import { usePost } from "next-common/context/post";
import MyReferendumVoteProvider from "next-common/context/referenda/myVote";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import dynamicPopup from "next-common/lib/dynamic/popup";
import MyVoteOnActiveReferendum from "./info";
import { useSharedPopupOpenState } from "next-common/context/popup/switch";

const RemoveReferendaVotePopup = dynamicPopup(() =>
  import("next-common/components/myReferendumVote/removeReferendaVotePopup"),
);

function MyActiveVoteInner() {
  const [isRemovePopupOpen, setRemovePopupOpen] = useSharedPopupOpenState();
  const post = usePost();
  const trackId = post?.track;
  const referendumIndex = post?.referendumIndex;

  return (
    <>
      <MyVoteOnActiveReferendum />
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
  const finishHeight = useReferendumVotingFinishHeight();

  return (
    <>
      {finishHeight ? (
        <MyVoteOnFinishedReferendum />
      ) : (
        <MyReferendumVoteProvider trackId={trackId} address={address}>
          <MyActiveVoteInner />
        </MyReferendumVoteProvider>
      )}
    </>
  );
}

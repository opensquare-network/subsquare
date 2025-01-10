import { usePost } from "next-common/context/post";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useSharedRemovePopupOpen } from "next-common/context/referenda/myVote";
import VoteInfo from "./info";

const RemoveReferendaVotePopup = dynamicPopup(() =>
  import("next-common/components/myReferendumVote/removeReferendaVotePopup"),
);

export default function MyVoteOnActiveReferendum() {
  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  const trackId = post?.track;
  const [isRemovePopupOpen, setRemovePopupOpen] = useSharedRemovePopupOpen();

  return (
    <>
      <VoteInfo />
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

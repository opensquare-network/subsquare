import dynamicPopup from "next-common/lib/dynamic/popup";
import { useSharedPopupOpenState } from "next-common/context/popup/switch";
import { usePost } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import DirectVoteInfo from "./direct";
import MyDelegatingVote from "./delegating";

const RemoveDemocracyVotePopup = dynamicPopup(() =>
  import("next-common/components/myReferendumVote/removeDemocracyVotePopup"),
);

export function MyVoteOnActiveReferendumByType() {
  const realAddress = useRealAddress();

  const { result: votingOf, loading } = useSubStorage(
    "democracy",
    "votingOf",
    realAddress,
  );

  if (loading || !votingOf) {
    return null;
  } else if (votingOf.isDirect) {
    return <DirectVoteInfo direct={votingOf.asDirect} />;
  } else if (votingOf.isDelegating) {
    return <MyDelegatingVote delegating={votingOf.asDelegating} />;
  } else {
    return null;
  }
}

export default function MyVoteOnActiveReferendum() {
  const [isRemovePopupOpen, setRemovePopupOpen] = useSharedPopupOpenState();
  const post = usePost();
  const referendumIndex = post?.referendumIndex;

  return (
    <>
      <MyVoteOnActiveReferendumByType />
      {isRemovePopupOpen && (
        <RemoveDemocracyVotePopup
          referendumIndex={referendumIndex}
          onClose={() => setRemovePopupOpen(false)}
        />
      )}
    </>
  );
}

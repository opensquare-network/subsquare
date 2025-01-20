import { usePost } from "next-common/context/post";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import DirectVoteInfo from "./direct";
import dynamicPopup from "next-common/lib/dynamic/popup";
import PopupComponentAndStateProvider from "next-common/context/popup/switch";

const RemoveDemocracyVotePopup = dynamicPopup(() =>
  import("next-common/components/myReferendumVote/removeDemocracyVotePopup"),
);

export function MyVoteOnActiveReferendumByType() {
  const post = usePost();
  const referendumIndex = post?.referendumIndex;
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
    // todo: show delegating vote
  } else {
    return null;
  }
}

export default function MyVoteOnActiveReferendum() {
  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  const popup = <RemoveDemocracyVotePopup referendumIndex={referendumIndex} />;

  return (
    <PopupComponentAndStateProvider popup={popup}>
      <MyVoteOnActiveReferendumByType />
    </PopupComponentAndStateProvider>
  );
}

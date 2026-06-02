import useDemocracyVoteFinishedHeight from "next-common/context/post/democracy/referendum/voteFinishedHeight";
import MyVoteOnFinishedDemocracyReferendum from "./finished";
import MyVoteOnActiveReferendum from "./active";
import PopupOpenStateProvider from "next-common/context/popup/switch";

export default function NewMyVote() {
  const finishHeight = useDemocracyVoteFinishedHeight();

  if (finishHeight) {
    return <MyVoteOnFinishedDemocracyReferendum />;
  } else {
    return (
      <PopupOpenStateProvider>
        <MyVoteOnActiveReferendum />
      </PopupOpenStateProvider>
    );
  }
}

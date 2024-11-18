import DetailContentBase from "next-common/components/detail/common/detailBase";
import ReferendumNavigation from "next-common/components/detail/navigation/ReferendumNavigation";
import ReferendumVoteEndCountDown from "next-common/components/democracy/referendum/voteEndCountDown";
import PostTitle from "next-common/components/detail/common/Title";
import DemocracyReferendumMeta from "next-common/components/detail/Democracy/referendum/meta";
import ExecutionCountdown from "next-common/components/detail/Democracy/referendum/executionCountdown";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import DemocracyPreimageWarning from "next-common/components/detail/Democracy/referendum/preimageWraning";
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";

export default function DemocracyReferendaDetail() {
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={
        !isEditing && (
          <>
            <DemocracyPreimageWarning />
            <ExecutionCountdown />
            <ReferendumVoteEndCountDown />
            <ReferendumNavigation />
          </>
        )
      }
      title={<PostTitle />}
      meta={<DemocracyReferendumMeta />}
    >
      <MaybeSimaDiscussionArticleContent />
    </DetailContentBase>
  );
}

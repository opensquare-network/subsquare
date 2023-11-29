import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import ArticleContent from "next-common/components/articleContent";
import ReferendumNavigation from "next-common/components/detail/navigation/ReferendumNavigation";
import ReferendumVoteEndCountDown from "next-common/components/democracy/referendum/voteEndCountDown";
import PostTitle from "next-common/components/detail/common/Title";
import DemocracyReferendumMeta from "next-common/components/detail/Democracy/referendum/meta";
import ExecutionCountdown from "next-common/components/detail/Democracy/referendum/executionCountdown";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";

export default function DemocracyReferendaDetail() {
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={
        !isEditing && (
          <>
            <ExecutionCountdown />
            <ReferendumVoteEndCountDown />
            <ReferendumNavigation />
          </>
        )
      }
      title={<PostTitle />}
      meta={<DemocracyReferendumMeta />}
    >
      <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}

import DetailContentBase from "../common/detailBase";
import ArticleContent from "../../articleContent";
import SimaDiscussionArticleContent from "next-common/sima/components/post/detailItem/articleContent";
import useSetEdit from "../common/hooks/useSetEdit";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import PostTitle from "next-common/components/detail/common/Title";
import ReferendaPostMeta from "next-common/components/detail/common/openGov/meta";
import ReferendaWhiteListNavigation from "next-common/components/detail/referenda/whitelistNavigation";
import ReferendaReferendumNavigation from "next-common/components/detail/navigation/referendaReferendumNavigation";
import TimeoutCountdown from "next-common/components/detail/referenda/timeoutCountdown";
import PreimageWarning from "next-common/components/detail/referenda/preimageWarning";
import TimeoutGuard from "next-common/components/detail/common/openGov/timeoutGuard";
import ReferendaReferendumTreasurySpendNavigation from "next-common/components/detail/referenda/referendaReferendumTreasurySpendNavigation";
import { usePost } from "next-common/context/post";
import { isLinkedToSimaDiscussion } from "next-common/sima/actions/common";

export default function ReferendaDetail() {
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);
  const post = usePost();

  return (
    <DetailContentBase
      head={
        !isEditing && (
          <>
            <PreimageWarning />
            <TimeoutGuard>
              <TimeoutCountdown />
            </TimeoutGuard>
            <ReferendaWhiteListNavigation />
            <ReferendaReferendumNavigation />
            <ReferendaReferendumTreasurySpendNavigation />
          </>
        )
      }
      title={<PostTitle />}
      meta={<ReferendaPostMeta />}
    >
      {isLinkedToSimaDiscussion(post) ? (
        <SimaDiscussionArticleContent className="mt-6" setIsEdit={setIsEdit} />
      ) : (
        <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
      )}
    </DetailContentBase>
  );
}

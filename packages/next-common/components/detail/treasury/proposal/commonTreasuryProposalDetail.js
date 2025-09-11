import DetailContentBase from "../../common/detailBase";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import TreasuryProposalPostMeta from "next-common/components/detail/treasury/proposal/meta";
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";

export default function CommonTreasuryProposalDetail({ head }) {
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={!isEditing && head}
      title={<PostTitle />}
      meta={<TreasuryProposalPostMeta />}
    >
      <MaybeSimaDiscussionArticleContent />
    </DetailContentBase>
  );
}

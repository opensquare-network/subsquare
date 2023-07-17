import DetailContentBase from "../common/detailBase";
import ArticleContent from "../../articleContent";
import { usePost } from "../../../context/post";
import useSetEdit from "../common/hooks/useSetEdit";
import PostTitle from "next-common/components/detail/common/Title";
import Divider from "next-common/components/styled/layout/divider";
import ReferendaPostMeta from "next-common/components/detail/common/openGov/meta";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import FellowshipWhitelistNavigation from "next-common/components/detail/fellowship/whitelistNavigation";

export default function FellowshipReferendaDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase>
      {!isEditing && (
        <>
          <FellowshipWhitelistNavigation />
        </>
      )}
      <PostTitle />
      <Divider className="my-4" />
      <ReferendaPostMeta isFellowship />
      <ArticleContent
        className="mt-6"
        post={post}
        onReply={onReply}
        setIsEdit={setIsEdit}
      />
    </DetailContentBase>
  );
}

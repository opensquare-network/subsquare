import { usePost } from "../../../context/post";
import DetailContentBase from "../common/detailBase";
import ArticleContent from "../../articleContent";
import useSetEdit from "../common/hooks/useSetEdit";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import PostTitle from "next-common/components/detail/common/Title";
import Divider from "next-common/components/styled/layout/divider";
import ReferendaPostMeta from "next-common/components/detail/common/openGov/meta";
import ReferendaWhiteListNavigation from "next-common/components/detail/referenda/whitelistNavigation";
import ReferendaReferendumNavigation from "next-common/components/detail/navigation/referendaReferendumNavigation";
import TimeoutCountdown from "next-common/components/detail/referenda/timeoutCountdown";

export default function ReferendaDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase>
      {!isEditing && (
        <>
          <TimeoutCountdown />
          <ReferendaWhiteListNavigation />
          <ReferendaReferendumNavigation />
        </>
      )}
      <PostTitle />
      <Divider className="my-4" />
      <ReferendaPostMeta />

      <ArticleContent
        className="mt-6"
        post={post}
        onReply={onReply}
        setIsEdit={setIsEdit}
      />
    </DetailContentBase>
  );
}

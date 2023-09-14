import DetailContentBase from "../../common/detailBase";
import ArticleContent from "../../../articleContent";
import { usePost } from "../../../../context/post";
import useSetEdit from "../../common/hooks/useSetEdit";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import Divider from "next-common/components/styled/layout/divider";
import CloseCountDown from "next-common/components/detail/treasury/tip/closeCountDown";
import TipPostMeta from "next-common/components/detail/treasury/tip/meta";

export default function TipDetail() {
  const post = usePost();
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase>
      {!isEditing && (
        <>
          <CloseCountDown />
        </>
      )}
      <PostTitle />
      <Divider className="my-4" />
      <TipPostMeta />
      <ArticleContent className="mt-6" post={post} setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}

import DetailContentBase from "../../common/detailBase";
import ArticleContent from "../../../articleContent";
import useSetEdit from "../../common/hooks/useSetEdit";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import CloseCountDown from "next-common/components/detail/treasury/tip/closeCountDown";
import TipPostMeta from "next-common/components/detail/treasury/tip/meta";

export default function TipDetail() {
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={
        !isEditing && (
          <>
            <CloseCountDown />
          </>
        )
      }
      title={<PostTitle />}
      meta={<TipPostMeta />}
    >
      <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}

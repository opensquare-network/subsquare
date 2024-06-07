import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import ArticleContent from "next-common/components/articleContent";
import PostTitle from "next-common/components/detail/common/Title";
import TreasurySpendNavigation from "next-common/components/detail/treasury/spend/navigation";
import TreasurySpendPostMeta from "next-common/components/detail/treasury/spend/headerMeta";

export default function TreasurySpendDetail() {
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={
        !isEditing && (
          <>
            <TreasurySpendNavigation />
          </>
        )
      }
      title={<PostTitle />}
      meta={<TreasurySpendPostMeta />}
    >
      <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}

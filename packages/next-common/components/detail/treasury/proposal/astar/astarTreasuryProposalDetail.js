import DetailContentBase from "next-common/components/detail/common/detailBase";
import ArticleContent from "next-common/components/articleContent";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import TreasuryAwardCountDown from "next-common/components/detail/treasury/proposal/awardCountDown";
import TreasuryProposalPostMeta from "next-common/components/detail/treasury/proposal/meta";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import AstarTreasuryProposalNavigation from "./astarTreasuryProposalNavigation";

export default function AstarTreasuryProposalDetail() {
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={
        !isEditing && (
          <>
            <TreasuryAwardCountDown />
            <AstarTreasuryProposalNavigation />
          </>
        )
      }
      title={<PostTitle />}
      meta={<TreasuryProposalPostMeta />}
    >
      <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}

import DetailContentBase from "../../common/detailBase";
import ArticleContent from "../../../articleContent";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import Divider from "next-common/components/styled/layout/divider";
import TreasuryAwardCountDown from "next-common/components/detail/treasury/proposal/awardCountDown";
import TreasuryProposalNavigation from "next-common/components/detail/navigation/treasuryProposalNavigation";
import TreasuryProposalPostMeta from "next-common/components/detail/treasury/proposal/meta";
import useSetEdit from "../../common/hooks/useSetEdit";

export default function TreasuryProposalDetail() {
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase>
      {!isEditing && (
        <>
          <TreasuryAwardCountDown />
          <TreasuryProposalNavigation />
        </>
      )}
      <PostTitle />
      <Divider className="my-4" />
      <TreasuryProposalPostMeta />
      <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}

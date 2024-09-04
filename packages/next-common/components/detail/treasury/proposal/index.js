import DetailContentBase from "../../common/detailBase";
import ArticleContent from "../../../articleContent";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import TreasuryAwardCountDown from "next-common/components/detail/treasury/proposal/awardCountDown";
import TreasuryProposalNavigation from "next-common/components/detail/navigation/treasuryProposalNavigation";
import TreasuryProposalPostMeta from "next-common/components/detail/treasury/proposal/meta";
import useSetEdit from "../../common/hooks/useSetEdit";
import { useIsCommunityTreasuryPage } from "next-common/components/summary/treasurySummary/useBeAwardedAPI";
import CommunityTreasuryAwardCountDown from "next-common/components/detail/treasury/proposal/communityAwardCountDown";

function AwardCountDown() {
  const isCommunityTreasuryPage = useIsCommunityTreasuryPage();
  return isCommunityTreasuryPage ? (
    <CommunityTreasuryAwardCountDown />
  ) : (
    <TreasuryAwardCountDown />
  );
}

export default function TreasuryProposalDetail() {
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={
        !isEditing && (
          <>
            <AwardCountDown />
            <TreasuryProposalNavigation />
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

import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import PostTitle from "next-common/components/detail/common/Title";
import TreasurySpendByGov2Navigation from "next-common/components/detail/treasury/spend/treasurySpendByGov2Navigation";
import TreasurySpendPostMeta from "next-common/components/detail/treasury/spend/headerMeta";
import TreasurySpendValidCountdown from "next-common/components/detail/treasury/spend/validCountdown";
import TreasurySpendExpireCountdown from "next-common/components/detail/treasury/spend/expireCountDown";
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";

export default function TreasurySpendDetail() {
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={
        !isEditing && (
          <>
            <TreasurySpendByGov2Navigation />
            <TreasurySpendValidCountdown />
            <TreasurySpendExpireCountdown />
          </>
        )
      }
      title={<PostTitle />}
      meta={<TreasurySpendPostMeta />}
    >
      <MaybeSimaDiscussionArticleContent />
    </DetailContentBase>
  );
}

// kintsugi detail header, extracted from detail item
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PostTitle from "next-common/components/detail/common/Title";
import { KintsugiDemocracyProposalNavigation } from "next-common/components/detail/navigation/democracyProposal";
import { KintsugiReferendumNavigation } from "next-common/components/detail/navigation/ReferendumNavigation";
import PostMeta from "next-common/components/detail/container/Meta";
import ReferendumVoteEndCountDown from "next-common/components/democracy/referendum/voteEndCountDown";
import { useDetailType } from "next-common/context/page";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import DemocracyPreimageWarning from "next-common/components/detail/Democracy/referendum/preimageWraning";

export default function DetailHeader() {
  const type = useDetailType();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <>
      {!isEditing && (
        <>
          {type === detailPageCategory.DEMOCRACY_REFERENDUM && (
            <>
              <DemocracyPreimageWarning />
              <ReferendumVoteEndCountDown />
            </>
          )}
          {type === detailPageCategory.DEMOCRACY_PROPOSAL && (
            <KintsugiDemocracyProposalNavigation />
          )}
          {type === detailPageCategory.DEMOCRACY_REFERENDUM && (
            <KintsugiReferendumNavigation />
          )}
        </>
      )}
      <PostTitle />
      <div className="py-2" />
      <PostMeta />
    </>
  );
}

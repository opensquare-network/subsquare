// origin from `next/components/detailItem.js`
// https://github.com/opensquare-network/subsquare/pull/3107/files#diff-e35b3d25f03a97441a2846161a6bdb1715487b4949717a7f5a0abc70b5333942

// - navigation
// - countdown
// - title
// - post meta

import { detailPageCategory } from "next-common/utils/consts/business/category";
import PostMeta from "next-common/components/detail/container/Meta";
import PostTitle from "next-common/components/detail/common/Title";
import ReferendumNavigation from "next-common/components/detail/navigation/ReferendumNavigation";
import DemocracyProposalNavigation from "next-common/components/detail/navigation/democracyProposal";
import ExternalNavigation from "next-common/components/detail/navigation/external";
import TreasuryProposalNavigation from "next-common/components/detail/navigation/treasuryProposalNavigation";
import ReferendaReferendumNavigation from "next-common/components/detail/navigation/referendaReferendumNavigation";
import AnnouncementNavigation from "next-common/components/detail/navigation/announcementNavigation";
import ReferendumVoteEndCountDown from "next-common/components/democracy/referendum/voteEndCountDown";
import { useDetailType } from "next-common/context/page";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import Divider from "../styled/layout/divider";

export default function DetailHeader({ countDown = null }) {
  const type = useDetailType();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    !isEditing && (
      <>
        {type === detailPageCategory.DEMOCRACY_REFERENDUM && (
          <ReferendumVoteEndCountDown />
        )}

        {type === detailPageCategory.GOV2_REFERENDUM && (
          <ReferendaReferendumNavigation />
        )}

        {type === detailPageCategory.TREASURY_PROPOSAL && (
          <TreasuryProposalNavigation />
        )}

        {type === detailPageCategory.DEMOCRACY_EXTERNAL && (
          <ExternalNavigation />
        )}

        {type === detailPageCategory.DEMOCRACY_PROPOSAL && (
          <DemocracyProposalNavigation />
        )}

        {type === detailPageCategory.DEMOCRACY_REFERENDUM && (
          <ReferendumNavigation />
        )}

        <AnnouncementNavigation />
        {countDown}
        <PostTitle />
        <Divider className="my-4" />
        <PostMeta />
      </>
    )
  );
}

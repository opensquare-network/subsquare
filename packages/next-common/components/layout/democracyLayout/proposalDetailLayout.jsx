import { usePost } from "next-common/context/post";
import DetailLayout from "../DetailLayoutV2";
import ReferendumNavigation from "next-common/components/detail/navigation/ReferendumNavigation";
import ReferendumVoteEndCountDown from "next-common/components/democracy/referendum/voteEndCountDown";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import Divider from "next-common/components/styled/layout/divider";
import PostMeta from "next-common/components/detail/container/Meta";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import ExternalNavigation from "next-common/components/detail/navigation/external";
import DemocracyProposalNavigation from "next-common/components/detail/navigation/democracyProposal";
import TreasuryProposalNavigation from "next-common/components/detail/navigation/treasuryProposalNavigation";
import ReferendaReferendumNavigation from "next-common/components/detail/navigation/referendaReferendumNavigation";
import AnnouncementNavigation from "next-common/components/detail/navigation/announcementNavigation";
import MaliciousHead from "next-common/components/detail/maliciousHead";

/**
 * @param {{countDown: JSX.Element} & import("../DetailLayoutV2").DetailLayoutProps} props
 */
export default function DemocracyPublicProposalDetailLayout({
  countDown,
  ...props
}) {
  const post = usePost();
  const isEditing = useSelector(isEditingPostSelector);
  const type = useDetailType();

  return (
    <DetailLayout
      header={
        props.detail && (
          <>
            {!isEditing && (
              <>
                {post?.isMalicious && <MaliciousHead />}
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
                  <ExternalNavigation post={post} />
                )}
                {type === detailPageCategory.DEMOCRACY_PROPOSAL && (
                  <DemocracyProposalNavigation
                    proposalIndex={post.proposalIndex}
                    referendumIndex={post?.referendumIndex}
                  />
                )}
                {type === detailPageCategory.DEMOCRACY_REFERENDUM && (
                  <ReferendumNavigation post={post} />
                )}
                <AnnouncementNavigation />
                {countDown}
              </>
            )}
            <PostTitle />
            <Divider className="my-4" />
            <PostMeta />
          </>
        )
      }
      {...props}
    >
      {props.children}
    </DetailLayout>
  );
}

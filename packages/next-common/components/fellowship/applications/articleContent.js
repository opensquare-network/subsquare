import { useState } from "react";
import styled from "styled-components";
import ArticleActions from "next-common/components/actions/articleActions";
import Divider from "next-common/components//styled/layout/divider";
import NonEdited from "next-common/components//detail/common/NonEdited";
import PostContent from "next-common/components//detail/common/PostContent";
import { usePost } from "next-common/context/post";
import { isPostEdited } from "next-common/utils/post";
import Tabs from "next-common/components/tabs";
import ContentSummary from "next-common/components//contentSummary";
import PostDataSource from "next-common/components//postDataSource";
import AddressAvatar from "next-common/components/user/addressAvatar";
import IdentityInfo from "./identityInfo";
import CollectivesProvider from "next-common/context/collectives/collectives";
import Induct from "./induct";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";
import useSubCollectiveRank from "next-common/hooks/collectives/useSubCollectiveRank";
import FellowshipRank from "../rank";
import CoreFellowshipMemberPromotionPeriod from "next-common/components/collectives/core/member/promotionPeriod";
import CoreFellowshipMemberDemotionPeriod from "next-common/components/collectives/core/member/demotionPeriod";
import useCoreFellowshipParams from "next-common/hooks/fellowship/core/useCoreFellowshipParams";

const Wrapper = styled.div`
  :hover {
    .edit {
      display: block;
    }
  }
`;

function NotInductedApplicant({ address }) {
  return (
    <div className="flex justify-between items-center rounded-[8px] border border-neutral400 p-[16px]">
      <div className="flex gap-[16px]">
        <AddressAvatar address={address} size={40} />
        <IdentityInfo address={address} />
      </div>
      <CollectivesProvider>
        <Induct address={address} />
      </CollectivesProvider>
    </div>
  );
}

function InductedApplicant({ address, member, rank }) {
  const { params, isLoading } = useCoreFellowshipParams();
  if (isLoading) {
    return null;
  }

  return (
    <div className="flex justify-between items-center rounded-[8px] border border-neutral400 p-[16px]">
      <div className="flex items-center gap-[16px]">
        <FellowshipRank rank={rank} />
        <div className="flex gap-[12px]">
          <AddressAvatar address={address} size={40} />
          <IdentityInfo address={address} />
        </div>
      </div>
      <div className="flex gap-[16px]">
        <CoreFellowshipMemberDemotionPeriod
          {...member}
          rank={rank}
          params={params}
        />
        {rank > 0 && (
          <CoreFellowshipMemberPromotionPeriod
            {...member}
            rank={rank}
            params={params}
          />
        )}
      </div>
    </div>
  );
}

function Applicant({ address }) {
  const { member, isLoading: isMemberLoading } =
    useSubFellowshipCoreMember(address);
  const { rank, isLoading: isRankLoading } = useSubCollectiveRank(address);

  if (isMemberLoading || isRankLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <span className="text14Bold">Applicant</span>
      {member ? (
        <InductedApplicant address={address} member={member} rank={rank} />
      ) : (
        <NotInductedApplicant address={address} />
      )}
    </div>
  );
}

export default function ArticleContent({ setIsEdit, className = "" }) {
  const post = usePost();

  const postContent = (
    <>
      <PostContent post={post} />
      {isPostEdited(post) && (
        <div className="mt-4 text12Medium text-textTertiary">Edited</div>
      )}
    </>
  );

  const tabs = [
    {
      value: "content",
      label: "Content",
      content: postContent,
    },
    post.contentSummary?.summary && {
      value: "ai_summary",
      label: "AI Summary",
      content: <ContentSummary />,
    },
  ].filter(Boolean);
  const [activeValue, setActiveValue] = useState(tabs[0].value);

  return (
    <Wrapper className={className}>
      {!post.content && (
        <>
          <Divider className="mb-4" />
          <NonEdited setIsEdit={setIsEdit} />
        </>
      )}

      {post.content && (
        <div className="mt-6">
          {post.contentSummary?.summary ? (
            <Tabs
              activeTabValue={activeValue}
              tabs={tabs}
              onTabClick={(tab) => {
                setActiveValue(tab.value);
              }}
            />
          ) : (
            <>
              <Divider className="mb-4" />
              {postContent}
            </>
          )}
          <Divider className="my-4" />
          <CollectivesProvider>
            <Applicant address={post.applicant} />
          </CollectivesProvider>
        </div>
      )}

      <ArticleActions setIsEdit={setIsEdit} extraActions={<PostDataSource />} />
    </Wrapper>
  );
}

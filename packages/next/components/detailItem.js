import styled from "styled-components";
import { useState } from "react";
import ArticleContent from "next-common/components/articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { NoticeWrapper } from "next-common/components/styled/containers/titleContainer";
import PostTitle from "next-common/components/detail/common/Title";
import PostMeta from "next-common/components/detail/container/Meta";
import {
  CouncilMotionNavigator,
  DemocracyExternalNavigator,
  DemocracyProposalNavigator,
  ReferendumNavigationItem,
  TechCommMotionNavigator
} from "next-common/components/detail/navigation/navigators";

const ReferendaWrapper = styled(NoticeWrapper)`
  > div {
    display: flex;
    align-items: center;
  }

  > div > svg {
    margin-right: 8px;
    fill: ${(props) => props.theme.textTertiary};
  }

  a {
    color: ${(props) => props.theme.secondarySapphire500};
  }

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function DetailItem({
  data,
  user,
  chain,
  onReply,
  type,
  votes,
  myVote,
  countDown = null,
}) {
  const [post, setPost] = useState(data);
  const [isEdit, setIsEdit] = useState(false);
  if (!post) {
    return null;
  }

  return (
    <EditablePanel>
      {!isEdit && (
        <>
          {type === detailPageCategory.DEMOCRACY_EXTERNAL && (
            <ReferendaWrapper>
              {post?.onchainData?.motions?.map((motion, key) => (
                <CouncilMotionNavigator key={ key } motion={ motion } hasTriangle={ false } />
              ))}
              <DemocracyExternalNavigator hash={post?.externalProposalHash} isLink={false}/>
              {post?.onchainData?.techCommMotions?.map(
                (techCommMotion, key) => <TechCommMotionNavigator motion={ techCommMotion } key={ key } />
              )}
              {post?.onchainData?.councilMotions?.map((motion, key) => (
                <CouncilMotionNavigator key={key} motion={motion}/>
              ))}
              <ReferendumNavigationItem referendumIndex={ post?.referendumIndex } />
            </ReferendaWrapper>
          )}
          { type === detailPageCategory.DEMOCRACY_PROPOSAL &&
            <ReferendaWrapper>
              <DemocracyProposalNavigator proposalIndex={post.proposalIndex} isLink={false}/>
              <ReferendumNavigationItem referendumIndex={ post?.referendumIndex }/>
            </ReferendaWrapper>
          }
          {type === detailPageCategory.DEMOCRACY_REFERENDUM &&
            post.externalProposalHash !== undefined && (
              <ReferendaWrapper>
                {post?.onchainData?.motions?.map((motion, key) =>
                  <CouncilMotionNavigator key={key} motion={motion} hasTriangle={false}/>)}
                <DemocracyExternalNavigator
                  blockHeight={post.externalProposalIndexer?.blockHeight}
                  hash={post.externalProposalHash}
                />
                {post?.onchainData?.techCommMotions?.map(
                  (techCommMotion, key) => <TechCommMotionNavigator motion={ techCommMotion } key={ key } />
                )}

                {/* used for centrifuge/altair, they use council to fast_track external proposal */}
                {post?.onchainData?.councilMotions?.map((motion, key) => (
                  <CouncilMotionNavigator key={key} motion={motion} hasTriangle={false}/>
                ))}

                <ReferendumNavigationItem referendumIndex={ post?.referendumIndex } isLink={ false } />
              </ReferendaWrapper>
            )}
          {type === detailPageCategory.DEMOCRACY_REFERENDUM &&
            post.proposalIndex !== undefined && (
              <ReferendaWrapper>
                <DemocracyProposalNavigator proposalIndex={post.proposalIndex}/>
                <ReferendumNavigationItem referendumIndex={ post?.referendumIndex } isLink={ false } />
              </ReferendaWrapper>
            )}
          {countDown}
          <PostTitle index={post.index} title={post.title}/>
          <PostMeta post={post} type={type}/>
        </>
      )}
      <ArticleContent
        chain={chain}
        post={post}
        votes={votes}
        myVote={myVote}
        setPost={setPost}
        user={user}
        type={type}
        onReply={onReply}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
    </EditablePanel>
  );
}

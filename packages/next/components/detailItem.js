import { useState } from "react";
import ArticleContent from "next-common/components/articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PostTitle from "next-common/components/detail/common/Title";
import PostMeta from "next-common/components/detail/container/Meta";
import {
  CouncilMotionNavigator,
  DemocracyExternalNavigator,
  DemocracyProposalNavigator,
  NavigationWrapper,
  ReferendumNavigationItem,
  TechCommMotionNavigator
} from "next-common/components/detail/navigation/navigators";

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
            <NavigationWrapper>
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
            </NavigationWrapper>
          )}
          { type === detailPageCategory.DEMOCRACY_PROPOSAL &&
            <NavigationWrapper>
              <DemocracyProposalNavigator proposalIndex={post.proposalIndex} isLink={false}/>
              <ReferendumNavigationItem referendumIndex={ post?.referendumIndex }/>
            </NavigationWrapper>
          }
          {type === detailPageCategory.DEMOCRACY_REFERENDUM &&
            post.externalProposalHash !== undefined && (
              <NavigationWrapper>
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
              </NavigationWrapper>
            )}
          {type === detailPageCategory.DEMOCRACY_REFERENDUM &&
            post.proposalIndex !== undefined && (
              <NavigationWrapper>
                <DemocracyProposalNavigator proposalIndex={post.proposalIndex}/>
                <ReferendumNavigationItem referendumIndex={ post?.referendumIndex } isLink={ false } />
              </NavigationWrapper>
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

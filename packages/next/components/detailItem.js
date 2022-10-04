import styled from "styled-components";
import { useState } from "react";
import Link from "next/link";
import TriangleRight from "../public/imgs/icons/arrow-triangle-right.svg";
import ArticleContent from "next-common/components/articleContent";
import { EditablePanel } from "next-common/components/styled/panel";
import { getMotionId, shortMotionId } from "next-common/utils/motion";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { NoticeWrapper } from "next-common/components/styled/containers/titleContainer";
import PostTitle from "next-common/components/detail/common/Title";
import PostMeta from "next-common/components/detail/container/Meta";
import isNil from "lodash.isnil";
import { useSelector } from "react-redux";
import { chainSelector } from "next-common/store/reducers/chainSlice";

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

function ReferendumLink({referendumIndex}) {
  return (
    <Link href={`/democracy/referendum/${referendumIndex}`}>
      {`Referendum #${referendumIndex}`}
    </Link>
  )
}

function ReferendumNavigationItem({referendumIndex, isLink = true}) {
  if (isNil(referendumIndex)) {
    return null
  }

  let item = <ReferendumLink referendumIndex={ referendumIndex } />;
  if (!isLink) {
    item = <div>{`Referendum #${referendumIndex}`}</div>;
  }

  return <div>
    <TriangleRight />
    { item }
  </div>
}

function DemocracyProposalNavigator({proposalIndex, isLink = true}) {
  if (!isLink) {
    return <div>{`Proposal #${proposalIndex}`}</div>
  }

  return <Link href={`/democracy/proposal/${proposalIndex}`}>
    {`Proposal #${proposalIndex}`}
  </Link>
}

function DemocracyExternalNavigator({blockHeight, hash = "", isLink = true}) {
  let link = <Link
    passHref={ true }
    href={ `/democracy/external/${ blockHeight }_${ hash }` }
  >
    <a>
      { `External #${ hash.slice(0, 6) }` }
    </a>
  </Link>

  if (!isLink) {
    link = `External #${hash?.slice(0, 6)}`
  }

  return <div>
    <TriangleRight />
    {link}
  </div>
}

function CouncilMotionNavigator({ motion, hasTriangle = true }) {
  let triangle = hasTriangle ? <TriangleRight /> : null;
  const chain = useSelector(chainSelector);

  return <div>
    {triangle}
    <Link href={ `/council/motion/${ getMotionId(motion, chain) }` }>
      { `Motion #${ shortMotionId(motion) }` }
    </Link>
  </div>
}

function TechCommMotionNavigator({motion}) {
  const chain = useSelector(chainSelector);

  return <div>
    <TriangleRight />
    <Link
      href={ `/techcomm/proposal/${ getMotionId(motion, chain) }` }
    >
      { `Tech. Comm. #${ shortMotionId(motion) }` }
    </Link>
  </div>
}

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
          <PostTitle post={post}/>
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

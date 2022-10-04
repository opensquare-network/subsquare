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
                <div key={key}>
                  <Link href={`/council/motion/${getMotionId(motion, chain)}`}>
                    {`Motion #${shortMotionId(motion)}`}
                  </Link>
                </div>
              ))}
              <div>
                <TriangleRight />
                {`External #${post?.externalProposalHash?.slice(0, 6)}`}
              </div>
              {post?.onchainData?.techCommMotions?.map(
                (techCommMotion, key) => (
                  <div key={key}>
                    <TriangleRight />
                    <Link
                      href={`/techcomm/proposal/${getMotionId(
                        techCommMotion,
                        chain
                      )}`}
                    >
                      {`Tech. Comm. #${shortMotionId(techCommMotion)}`}
                    </Link>
                  </div>
                )
              )}
              {post?.onchainData?.councilMotions?.map((motion, key) => (
                <div key={key}>
                  <TriangleRight />
                  <Link href={`/council/motion/${getMotionId(motion)}`}>
                    {`Motion #${shortMotionId(motion)}`}
                  </Link>
                </div>
              ))}
              {post?.referendumIndex !== undefined && (
                <div>
                  <TriangleRight />
                  <Link href={`/democracy/referendum/${post?.referendumIndex}`}>
                    {`Referendum #${post?.referendumIndex}`}
                  </Link>
                </div>
              )}
            </ReferendaWrapper>
          )}
          {type === detailPageCategory.DEMOCRACY_PROPOSAL && (
            <ReferendaWrapper>
              <div>{`Proposal #${post.proposalIndex}`}</div>
              {post?.referendumIndex !== undefined && (
                <div>
                  <TriangleRight />
                  <Link href={`/democracy/referendum/${post.referendumIndex}`}>
                    {`Referendum #${post?.referendumIndex}`}
                  </Link>
                </div>
              )}
            </ReferendaWrapper>
          )}
          {type === detailPageCategory.DEMOCRACY_REFERENDUM &&
            post.externalProposalHash !== undefined && (
              <ReferendaWrapper>
                {post?.onchainData?.motions?.map((motion, key) => (
                  <div key={key}>
                    <Link
                      href={`/council/motion/${getMotionId(motion, chain)}`}
                    >
                      {`Motion #${shortMotionId(motion)}`}
                    </Link>
                  </div>
                ))}
                <div>
                  <TriangleRight />
                  <Link
                    passHref={true}
                    href={`/democracy/external/${post.externalProposalIndexer.blockHeight}_${post.externalProposalHash}`}
                  >
                    <a>
                      {`External #${post?.externalProposalHash?.slice(0, 6)}`}
                    </a>
                  </Link>
                </div>
                {post?.onchainData?.techCommMotions?.map(
                  (techCommMotion, key) => (
                    <div key={key}>
                      <TriangleRight />
                      <Link
                        href={`/techcomm/proposal/${getMotionId(
                          techCommMotion,
                          chain
                        )}`}
                      >
                        {`Tech. Comm. #${shortMotionId(techCommMotion)}`}
                      </Link>
                    </div>
                  )
                )}
                {post?.onchainData?.councilMotions?.map((motion, key) => (
                  <div key={key}>
                    <TriangleRight />
                    <Link href={`/council/motion/${getMotionId(motion)}`}>
                      {`Motion #${shortMotionId(motion)}`}
                    </Link>
                  </div>
                ))}
                <div>
                  <TriangleRight />
                  <div>{`Referendum #${post?.referendumIndex}`}</div>
                </div>
              </ReferendaWrapper>
            )}
          {type === detailPageCategory.DEMOCRACY_REFERENDUM &&
            post.proposalIndex !== undefined && (
              <ReferendaWrapper>
                <Link href={`/democracy/proposal/${post.proposalIndex}`}>
                  {`Proposal #${post.proposalIndex}`}
                </Link>
                <div>
                  <TriangleRight />
                  <div>{`Referendum #${post?.referendumIndex}`}</div>
                </div>
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

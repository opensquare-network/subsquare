import React from "react";
import styled from "styled-components";
import Flex from "../../styled/flex";
import User from "../../user";
import TypeTag from "../common/TypeTag";
import UpdatedTime from "../common/UpdatedTime";
import Info from "../../styled/info";
import Tag from "../../tags/state/tag";
import isNil from "lodash.isnil";
import { usePost, usePostState } from "../../../context/post";
import { getMotionStateArgs } from "../../../utils/collective/result";
import { getGov2ReferendumStateArgs } from "../../../utils/gov2/result";
import { detailPageCategory } from "../../../utils/consts/business/category";
import { smcss } from "../../../utils/responsive";
import { hidden, inline_flex, items_center } from "../../../styles/tailwindcss";
import { useDetailType } from "../../../context/page";
import IpfsLink from "../../alliance/ipfsLink";
import PostLabels from "../../postLabels";
import { getDemocracyStateArgs } from "../../../utils/democracy/result";

const FlexWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ${smcss(hidden)};
    ${inline_flex};
    ${items_center};

    ::before {
      content: "·";
      font-size: 12px;
      color: ${(props) => props.theme.textTertiary};
      margin: 0 8px;
    }
  }
`;

export default function PostMeta() {
  const postState = usePostState();
  const detailType = useDetailType();
  const post = usePost();
  const noCommentsCount =
    isNil(post.commentsCount) && isNil(post.polkassemblyCommentsCount);
  const commentsCount =
    (post.commentsCount || 0) + (post.polkassemblyCommentsCount || 0);

  let stateArgs;
  if (
    [
      detailPageCategory.COUNCIL_MOTION,
      detailPageCategory.TECH_COMM_MOTION,
    ].includes(detailType)
  ) {
    stateArgs = getMotionStateArgs(post.onchainData.state);
  } else if (
    [
      detailPageCategory.GOV2_REFERENDUM,
      detailPageCategory.FELLOWSHIP_REFERENDUM,
    ].includes(detailType)
  ) {
    stateArgs = getGov2ReferendumStateArgs(post.onchainData.state);
  } else if (detailPageCategory.DEMOCRACY_REFERENDUM === detailType) {
    stateArgs = getDemocracyStateArgs(post.onchainData.state, post.onchainData.timeline);
  }

  return (
    <FlexWrapper>
      <DividerWrapper>
        <User
          user={post.author}
          add={post.proposer || post.finder}
          fontSize={12}
        />
        <TypeTag type={detailType} />
        <UpdatedTime post={post} />
        {!noCommentsCount && commentsCount > -1 && (
          <Info>{`${commentsCount} Comments`}</Info>
        )}
        {detailPageCategory.ALLIANCE_ANNOUNCEMENT === detailType && (
          <IpfsLink cid={post.cid} />
        )}
        {post.labels && post.labels.length > 0 && (
          <PostLabels labels={post.labels} />
        )}
      </DividerWrapper>

      {postState && (
        <Tag state={postState} category={detailType} args={stateArgs} />
      )}
    </FlexWrapper>
  );
}

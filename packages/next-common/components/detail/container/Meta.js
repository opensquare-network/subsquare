import React from "react";
import styled from "styled-components";
import Flex from "../../styled/flex";
import User from "../../user";
import TypeTag from "../common/TypeTag";
import UpdatedTime from "../common/UpdatedTime";
import Info from "../../styled/info";
import Tag from "../../tags/state/tag";
import isNil from "lodash.isnil";
import { usePost, usePostState, usePostType } from "../../../context/post";
import SubCategory from "./SubCategory";
import { getMotionStateArgs } from "../../../utils/collective/result";
import { getGov2ReferendumStateArgs } from "../../../utils/gov2/result";
import { detailPageCategory } from "../../../utils/consts/business/category";

const FlexWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;

  > :not(:first-child) {
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
  const detailType = usePostType();
  const post = usePost();
  // fixme: kintsugi post has no commentsCount field
  const noCommentsCount =
    isNil(post.commentsCount) && isNil(post.polkassemblyCommentsCount);
  const commentsCount =
    (post.commentsCount || 0) + (post.polkassemblyCommentsCount || 0);

  let stateArgs;
  if (
    [
      detailPageCategory.COUNCIL_MOTION,
      detailPageCategory.TECH_COMM_MOTION,
      detailPageCategory.DEMOCRACY_REFERENDUM,
    ].includes(detailType)
  ) {
    stateArgs = getMotionStateArgs(post.onchainData.state);
  } else if (detailPageCategory.GOV2_REFERENDUM === detailType) {
    stateArgs = getGov2ReferendumStateArgs(post.onchainData.state);
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
        <SubCategory />
      </DividerWrapper>
      {postState && (
        <Tag state={postState} category={detailType} args={stateArgs} />
      )}
    </FlexWrapper>
  );
}

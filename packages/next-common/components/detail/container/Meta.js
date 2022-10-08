import React from "react";
import styled from "styled-components";
import Flex from "../../styled/flex";
import User from "../../user";
import TypeTag from "../common/TypeTag";
import UpdatedTime from "../common/UpdatedTime";
import Info from "../../styled/info";
import Tag from "../../tags/state/tag";
import { useSelector } from "react-redux";
import { chainSelector } from "../../../store/reducers/chainSlice";
import isNil from "lodash.isnil";
import { detailTypeSelector, postSelector, postStateSelector } from "../../../store/reducers/postSlice";

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
  const chain = useSelector(chainSelector);
  const postState = useSelector(postStateSelector);
  const detailType = useSelector(detailTypeSelector)
  const post = useSelector(postSelector);

  if (!post) {
    return null;
  }

  // fixme: kintsugi post has no commentsCount field
  const noCommentsCount = isNil(post.commentsCount) && isNil(post.polkassemblyCommentsCount);
  const commentsCount =
    (post.commentsCount || 0) + (post.polkassemblyCommentsCount || 0);

  return <FlexWrapper>
    <DividerWrapper>
      <User
        user={post.author}
        add={post.proposer || post.finder}
        chain={chain}
        fontSize={12}
      />
      <TypeTag type={detailType}/>
      <UpdatedTime post={ post } />
      {(!noCommentsCount && commentsCount > -1) && <Info>{`${commentsCount} Comments`}</Info>}
    </DividerWrapper>
    {postState && <Tag state={postState} category={detailType} />}
  </FlexWrapper>
}

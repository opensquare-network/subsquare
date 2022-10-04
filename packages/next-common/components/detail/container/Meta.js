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

export default function PostMeta({ post, type }) {
  const chain = useSelector(chainSelector);
  // fixme: kintsugi post has no commentsCount field
  const noCommentsCount = isNil(post.commentsCount) && isNil(post.polkassemblyCommentsCount);
  const commentsCount =
    (post.commentsCount || 0) + (post.polkassemblyCommentsCount || 0);
  let state = post.status || post.state;

  return <FlexWrapper>
    <DividerWrapper>
      <User
        user={post.author}
        add={post.proposer || post.finder}
        chain={chain}
        fontSize={12}
      />
      <TypeTag type={type}/>
      <UpdatedTime post={ post } />
      {(!noCommentsCount && commentsCount > -1) && <Info>{`${commentsCount} Comments`}</Info>}
    </DividerWrapper>
    {state && <Tag state={state} category={type} />}
  </FlexWrapper>
}

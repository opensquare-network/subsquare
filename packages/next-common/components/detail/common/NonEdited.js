// Used when proposal author has not edited the auto generated post content.

import React from "react";
import styled from "styled-components";
import PostEdit from "./PostEdit";
import User from "../../user";
import { useSelector } from "react-redux";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { usePostType } from "../../../context/post";
import { useIsPostAuthor } from "../../../context/post/useIsPostAuthor";

const PlaceHolder = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: ${ (props) => props.theme.textTertiary };
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GreyWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  background: ${ (props) => props.theme.grey100Bg };
  border-radius: 4px;
  margin-top: 16px;
`;

const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: ${ (props) => props.theme.textSecondary };
  }
`;

function WhoCanEdit({ authors = [] }) {
  const chain = useSelector(chainSelector);

  return (
    <GreyWrapper>
      <span style={ { marginRight: 12 } }>Who can edit?</span>
      { authors.map((author) => (
        <GreyItem key={ author }>
          <User
            add={ author }
            showAvatar={ false }
            fontSize={ 12 }
          />
        </GreyItem>
      )) }
    </GreyWrapper>
  )
}

export default function NonEdited({ setIsEdit, authors }) {
  const type = usePostType();
  const isAuthor = useIsPostAuthor();
  return (
    <>
      <PlaceHolder>
        { `The ${ type } has not been edited by creator.` }
        { isAuthor && <PostEdit setIsEdit={ setIsEdit } /> }
      </PlaceHolder>
      <WhoCanEdit authors={authors}/>
    </>
  )
}

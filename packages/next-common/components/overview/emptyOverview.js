import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Icon from "../../assets/imgs/icons/new-discussion.svg";
import { TitleContainer } from "../styled/containers/titleContainer";

const Wrapper = styled.div`
  max-width: 932px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;

  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 768px) {
    margin-left: 16px;
    margin-right: 16px;
  }
`;

const EmptyPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 48px;
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  box-sizing: border-box;
  box-shadow: ${(props) => props.theme.shadow100};
  border-radius: 6px;

  > .title {
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textPrimary};
    margin-bottom: 16px;
  }

  > .desc {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 140%;
    text-align: center;
    color: ${(props) => props.theme.textSecondary};
    margin-bottom: 24px;
    max-width: 343px;
  }

  > .button {
    > svg {
      margin-right: 8px;
      min-width: 15px;
    }

    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px;

    position: static;
    width: 153px;
    min-width: 153px;
    height: 38px;

    background: ${(props) => props.theme.primaryPurple500};
    border-radius: 4px;

    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    text-align: center;
    color: white;
  }
`;

export default function EmptyOverview() {
  return (
    <Wrapper>
      <TitleContainer>Overview</TitleContainer>
      <EmptyPanel>
        <div className="title">Welcome to SubSquare</div>
        <div className="desc">
          Latest events will be displayed on this page. Any ideas? Start a
          discussion.
        </div>
        <Link href={"/post/create"}>
          <a className="button">
            <Icon />
            <span>New Discussion</span>
          </a>
        </Link>
      </EmptyPanel>
    </Wrapper>
  );
}

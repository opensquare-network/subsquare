import React from "react";
import styled from "styled-components";
import Link from "next/link";

import Flex from "next-common/components/styled/flex";
import Icon from "../../assets/imgs/icons/new-discussion.svg";

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

const Title = styled(Flex)`
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
`;

const EmptyPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 48px;
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-sizing: border-box;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;

  > .title {
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 100%;
    text-align: center;
    color: #1e2134;
    margin-bottom: 16px;
  }

  > .desc {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 140%;
    text-align: center;
    color: #506176;
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

    background: #6848ff;
    border-radius: 4px;

    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    text-align: center;
    color: #ffffff;
  }
`;

export default function EmptyOverview() {
  return (
    <Wrapper>
      <Title>Overview</Title>
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

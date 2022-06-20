import React from "react";
import styled from "styled-components";
import { timeDurationFromNow } from "../../utils";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Info = styled.div`
  display: flex;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  :not(:last-child) {
    ::after {
      content: "•";
      margin: 0 8px;
    }
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 140%;
  color: #1e2134;
`;

export default function PollHeader({ title, expiresTime, anonymous }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Info>
        <Item>Single</Item>
        {anonymous && <Item>Anonymous</Item>}
        <Item>{`Expired ${timeDurationFromNow(expiresTime)}`}</Item>
      </Info>
    </Wrapper>
  );
}

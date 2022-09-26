import React from "react";
import styled from "styled-components";
import useDuration from "../../utils/hooks/useDuration";

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
  color: ${(props) => props.theme.textSecondary};
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
  color: ${(props) => props.theme.textPrimary};
`;

export default function PollHeader({ title, expiresTime, anonymous }) {
  const duration = useDuration(expiresTime);
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Info>
        <Item>Single</Item>
        {anonymous && <Item>Anonymous</Item>}
        <Item>{`Expired ${duration}`}</Item>
      </Info>
    </Wrapper>
  );
}

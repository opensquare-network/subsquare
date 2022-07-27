import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  box-shadow: ${(props) => props.theme.shadow100};
  border-radius: 6px;
  padding: 48px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;
  margin-bottom: 24px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  :not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.grey200Border};
  }
`;

const Label = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  padding: 12px 0;
  width: 120px;
  flex: 0 0 128px;
  text-transform: capitalize;
`;

const Content = styled.div`
  padding: 12px 0;
  word-break: break-all;
  flex: 1 1 auto;
`;

export default function Metadata({ data }) {
  return (
    <Wrapper>
      <Title>Metadata</Title>
      {(data || []).map((item, index) => (
        <Item key={index}>
          <Label>{item[0]}</Label>
          <Content>{item[1]}</Content>
        </Item>
      ))}
    </Wrapper>
  );
}

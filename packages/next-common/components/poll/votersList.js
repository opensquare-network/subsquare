import React from "react";
import styled from "styled-components";
import User from "../user";

const Title = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.textSecondary};
  margin-right: 12px;
`;

const GreyWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  margin: 12px 16px;
`;

const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: #506176;
  }
`;

export default function VoterList({ voters }) {
  if (!voters || voters?.length === 0) {
    return null;
  }

  return (
    <GreyWrapper>
      <Title>Voted by:</Title>
      {(voters || []).map((user, index) => (
        <GreyItem key={index}>
          <User
            user={user}
            showAvatar={false}
            fontSize={12}
            color={"#506176"}
          />
        </GreyItem>
      ))}
    </GreyWrapper>
  );
}

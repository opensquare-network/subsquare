import React from "react";
import styled from "styled-components";
import SystemUser from "../user/systemUser";

const Title = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: var(--textSecondary);
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
    color: var(--textSecondary);
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
          <SystemUser
            user={user}
            showAvatar={false}
            className="text12Medium text-[#506176]"
          />
        </GreyItem>
      ))}
    </GreyWrapper>
  );
}

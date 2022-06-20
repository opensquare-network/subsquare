import React from "react";
import styled from "styled-components";
import User from "../user";

const GreyWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  margin: 12px 0;
`;

const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: #506176;
  }
`;

export default function VoterList({ voters, chain }) {
  if (!voters || voters?.length === 0) {
    return null;
  }

  return (
    <GreyWrapper>
      {(voters || []).map((user, index) => (
        <GreyItem key={index}>
          <User
            user={user}
            chain={chain}
            showAvatar={false}
            fontSize={12}
            color={"#506176"}
          />
        </GreyItem>
      ))}
    </GreyWrapper>
  );
}

import styled, { css } from "styled-components";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import InnerDataTable from "../table/innerDataTable";
import BigNumber from "bignumber.js";

const JsonView = dynamic(
  () => import("components/jsonView").catch((e) => console.error(e)),
  { ssr: false }
);

const Header = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  flex: none;
  flex: 0 0 128px;
`;

const ArgsWrapper = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  border: 24px solid #f6f7fa;
  padding-bottom: 24px;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  white-space: pre-wrap;
  width: 100%;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const TagWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const TagItem = styled.div`
  padding: 4px 8px;
  background: #f6f7fa;
  border-radius: 2px;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
  cursor: pointer;
  ${(p) =>
    p.active &&
    css`
      background: #f5f2ff;
      color: #6848ff;
    `}
`;

function convertProposal(proposal, chain) {
  return {
    ...proposal,
    args: Object.fromEntries(
      proposal.args.map((arg) => {
        switch (arg.type) {
          case "Call":
          case "CallOf": {
            return [arg.name, convertProposal(arg.value, chain)];
          }
          case "Vec<Call>":
          case "Vec<CallOf>": {
            return [arg.name, arg.value.map((v) => convertProposal(v, chain))];
          }
          case "Balance": {
            const value = new BigNumber(arg.value).toString();
            return [
              arg.name,
              value,
            ];
          }
          default: {
            return [arg.name, arg.value];
          }
        }
      })
    ),
  };
}

export default function MotionProposal({ motion, chain }) {
  const [callType, setCallType] = useState("table");

  useEffect(() => {
    const item = window.localStorage.getItem("callType");
    if (item) {
      setCallType(JSON.parse(item));
    }
  });

  const onClick = (value) => {
    window.localStorage.setItem("callType", JSON.stringify(value));
    setCallType(value);
  };

  return (
    <Wrapper>
      <HeaderWrapper>
        <Header>Call</Header>
        <TagWrapper>
          <TagItem
            active={callType === "table"}
            onClick={() => onClick("table")}
          >
            Table
          </TagItem>
          <TagItem active={callType === "json"} onClick={() => onClick("json")}>
            Json
          </TagItem>
        </TagWrapper>
      </HeaderWrapper>
      {callType === "table" && (
        <ArgsWrapper>
          <InnerDataTable data={convertProposal(motion.proposal, chain)} />
        </ArgsWrapper>
      )}
      {callType === "json" && (
        <ArgsWrapper>
          <JsonView src={motion.proposal} />
        </ArgsWrapper>
      )}
    </Wrapper>
  );
}

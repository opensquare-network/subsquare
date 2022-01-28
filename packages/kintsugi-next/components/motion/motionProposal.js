import styled, { css } from "styled-components";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import InnerDataTable from "components/table/innerDataTable";
import BigNumber from "bignumber.js";
import { hexToString } from "@polkadot/util";
import { hexEllipsis } from "utils";
const LongText = dynamic(() => import("components/longText"), { ssr: false });

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
  border-radius: 4px;
  border: 24px solid #f6f7fa;
  border-bottom: 24px solid #f6f7fa !important;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  white-space: pre-wrap;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  &.tag {
    background: #f6f7fa !important;
  }
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

function convertProposalForTableView(proposal, chain) {
  if (!proposal) {
    return {};
  }
  return {
    ...proposal,
    args: Object.fromEntries(
      proposal.args.map((arg) => {
        switch (arg.type) {
          case "OrmlTraitsChangeU128": {
            if (typeof arg.value === "string") {
              return [arg.name, new BigNumber(arg.value).toString()];
            }
            if (typeof arg.value === "object") {
              const argHexToString = {};
              Object.keys(arg.value).map((key) => {
                if (typeof arg.value[key] === "string") {
                  argHexToString[key] = new BigNumber(
                    arg.value[key]
                  ).toString();
                }
              });
              return [arg.name, argHexToString];
            }
          }
          case "Call":
          case "CallOf": {
            return [arg.name, convertProposalForTableView(arg.value, chain)];
          }
          case "Vec<Call>":
          case "Vec<CallOf>": {
            return [
              arg.name,
              arg.value.map((v) => convertProposalForTableView(v, chain)),
            ];
          }
          case "Bytes": {
            if (
              (proposal.section === "phalaRegistry" &&
                proposal.method === "addPruntime") ||
              (proposal.section === "system" && proposal.method === "setCode")
            ) {
              return [arg.name, <LongText text={arg.value} key="0" />];
            }
            return [arg.name, hexToString(arg.value)];
          }
          case "Balance": {
            const value = new BigNumber(arg.value).toString();
            return [arg.name, value];
          }
          case "Compact<Balance>": {
            const value = new BigNumber(arg.value).toString();
            return [arg.name, value];
          }
          default: {
            return [arg.name, arg.value];
          }
        }
      })
    ),
  };
}

function convertProposalForJsonView(proposal, chain) {
  if (!proposal) {
    return {};
  }
  return {
    ...proposal,
    args: proposal.args.map((arg) => ({
      ...arg,
      value: (() => {
        switch (arg.type) {
          case "Call":
          case "CallOf": {
            return convertProposalForJsonView(arg.value, chain);
          }
          case "Vec<Call>":
          case "Vec<CallOf>": {
            return arg.value.map((v) => convertProposalForJsonView(v, chain));
          }
          case "Bytes": {
            if (
              (proposal.section === "phalaRegistry" &&
                proposal.method === "addPruntime") ||
              (proposal.section === "system" && proposal.method === "setCode")
            ) {
              return arg.value?.length <= 200
                ? arg.value
                : hexEllipsis(arg.value);
            }
            return hexToString(arg.value);
          }
          case "Compact<Balance>": {
            const value = new BigNumber(arg.value).toString();
            return [arg.name, value];
          }
          default: {
            return arg.value;
          }
        }
      })(),
    })),
  };
}

export default function MotionProposal({ motion, chain }) {
  const [callType, setCallType] = useState("table");

  useEffect(() => {
    const item = window.localStorage.getItem("callType");
    if (item) {
      setCallType(JSON.parse(item));
    }
  }, []);

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
            className="tag"
            active={callType === "table"}
            onClick={() => onClick("table")}
          >
            Table
          </TagItem>
          <TagItem
            className="tag"
            active={callType === "json"}
            onClick={() => onClick("json")}
          >
            Json
          </TagItem>
        </TagWrapper>
      </HeaderWrapper>
      {callType === "table" && (
        <ArgsWrapper className="wrapper">
          <InnerDataTable
            data={convertProposalForTableView(motion.proposal, chain)}
          />
        </ArgsWrapper>
      )}
      {callType === "json" && (
        <ArgsWrapper className="wrapper">
          <JsonView src={convertProposalForJsonView(motion.proposal, chain)} />
        </ArgsWrapper>
      )}
    </Wrapper>
  );
}

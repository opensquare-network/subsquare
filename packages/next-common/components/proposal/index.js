import styled, { css } from "styled-components";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import InnerDataTable from "../table/innerDataTable";
import BigNumber from "bignumber.js";
import { hexToString } from "@polkadot/util";
import { hexEllipsis, toPrecision } from "../../utils";
import LargeDataPlaceHolder from "./largeDataPlaceHolder";
import { hexIsValidUTF8 } from "../../utils/utf8validate";
import { useChain } from "../../context/chain";
import getChainSettings from "../../utils/consts/settings";
import needCheckUtf8 from "./needCheckUtf8";

const LongText = dynamic(() => import("../longText"), {
  ssr: false,
});

const JsonView = dynamic(
  () => import("../jsonView").catch((e) => console.error(e)),
  { ssr: false }
);

const Header = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  flex: none;
  flex: 0 0 160px;
`;

const ArgsWrapper = styled.div`
  border-radius: 4px;
  border: 24px solid ${(props) => props.theme.grey100Bg};
  border-bottom: 24px solid ${(props) => props.theme.grey100Bg} !important;
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
  width: 100%;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const TagWrapper = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 8px;
  }

  @media (max-width: 768px) {
    margin-top: 8px;
  }
`;

const TagItem = styled.div`
  padding: 4px 8px;

  &.tag {
    background: ${(props) => props.theme.grey100Bg};
  }

  border-radius: 2px;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  color: ${(props) => props.theme.textSecondary};
  cursor: pointer;
  ${(p) =>
    p.active &&
    css`
      background: ${(props) => props.theme.primaryPurple100} !important;
      color: ${(props) => props.theme.primaryPurple500};
    `}
`;

function convertProposalForTableView(proposal, chain) {
  if (!proposal) {
    return {};
  }

  const { decimals, symbol } = getChainSettings(chain);
  const { section, method } = proposal;
  const isTreasurySpend = "treasury" === section && "spend" === method;

  return {
    ...proposal,
    args: Object.fromEntries(
      proposal.args.map((arg) => {
        if (isTreasurySpend && arg.name === "amount") {
          return [arg.name, `${toPrecision(arg.value, decimals)} ${symbol}`];
        }

        switch (arg.type) {
          case "OrmlTraitsChangeU128":
            {
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
            break;
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

            const { section, method } = proposal;
            if (needCheckUtf8(section, method, arg.name) && hexIsValidUTF8(arg.value)) {
              return [arg.name, hexToString(arg.value)];
            }

            return [arg.name, arg.value];
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

            if (
              ((proposal.section === "system" &&
                ["remark", "remarkWithEvent"].includes(proposal.method)) ||
                (proposal.section === "automationTime" &&
                  proposal.method === "scheduleNotifyTask" &&
                  arg.name === "message")) &&
              hexIsValidUTF8(arg.value)
            ) {
              return hexToString(arg.value);
            }

            return arg.value;
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

export default function Proposal({
  call = {},
  shorten,
  proposalIndex,
  motionIndex,
  referendumIndex,
}) {
  const chain = useChain();
  const [callType, setCallType] = useState("table");

  useEffect(() => {
    if (shorten) {
      setCallType("table");
      return;
    }
    const item = window.localStorage.getItem("callType");
    if (item) {
      setCallType(JSON.parse(item));
    }
  }, [shorten]);

  const onClick = (value) => {
    window.localStorage.setItem("callType", JSON.stringify(value));
    setCallType(value);
  };

  let dataTableData;
  if (shorten) {
    dataTableData = {
      ...call,
      args: (
        <LargeDataPlaceHolder
          referendumIndex={referendumIndex}
          motionIndex={motionIndex}
          proposalIndex={proposalIndex}
        />
      ),
    };
  } else {
    dataTableData = convertProposalForTableView(call, chain);
  }

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
          {!shorten && (
            <TagItem
              className="tag"
              active={callType === "json"}
              onClick={() => onClick("json")}
            >
              Json
            </TagItem>
          )}
        </TagWrapper>
      </HeaderWrapper>
      {callType === "table" && (
        <ArgsWrapper className="wrapper">
          <InnerDataTable data={dataTableData} />
        </ArgsWrapper>
      )}
      {callType === "json" && (
        <ArgsWrapper className="wrapper">
          <JsonView src={convertProposalForJsonView(call, chain)} />
        </ArgsWrapper>
      )}
    </Wrapper>
  );
}

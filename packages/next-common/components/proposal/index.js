import styled from "styled-components";
import { useState } from "react";
import BigNumber from "bignumber.js";
import { hexToString } from "@polkadot/util";
import { hexEllipsis, toPrecision } from "../../utils";
import LargeDataPlaceHolder from "./largeDataPlaceHolder";
import { hexIsValidUTF8 } from "../../utils/utf8validate";
import { useChain } from "../../context/chain";
import getChainSettings from "../../utils/consts/settings";
import needCheckUtf8 from "./needCheckUtf8";
import { ThemedTag } from "../tags/state/styled";
import { InfoDocs } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import Tooltip from "../tooltip";
import ProposalChildCalls from "./childCalls";
import usePreImageCallFromProposal from "./preImage";
import dynamicPopup from "next-common/lib/dynamic/popup";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const CallDetailPopup = dynamicPopup(() => import("../callDetailPopup"));

const LongText = dynamicClientOnly(() => import("../longText"));

const Header = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  flex: none;
  flex: 0 0 160px;
`;

export const ArgsWrapper = styled.div`
  border-radius: 4px;
  border: 24px solid var(--neutral200);
  border-bottom: 24px solid var(--neutral200) !important;
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

export function convertProposalForTableView(proposal, chain) {
  if (!proposal) {
    return {};
  }

  const { decimals, symbol } = getChainSettings(chain);
  const { section, method } = proposal;
  const isTreasurySpend = "treasury" === section && "spend" === method;

  if (!section || !method) {
    return {};
  }

  return {
    ...proposal,
    args: Object.fromEntries(
      (proposal.args || []).map((arg) => {
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
                      arg.value[key],
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
            if (
              needCheckUtf8(section, method, arg.name) &&
              hexIsValidUTF8(arg.value)
            ) {
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
      }),
    ),
  };
}

export function convertProposalForJsonView(proposal, chain) {
  if (!proposal) {
    return {};
  }

  const { section, method } = proposal;
  if (!section || !method) {
    return {};
  }

  return {
    ...proposal,
    args: (proposal.args || []).map((arg) => ({
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
  title = "Call",
  call = {},
  preImageHash,
  preImageHex,
  indexer,
  shorten,
  proposalIndex,
  motionIndex,
  referendumIndex,
}) {
  const chain = useChain();
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);

  const { call: rawCall, isLoading: isLoadingRawCall } =
    usePreImageCallFromProposal({ preImageHash, preImageHex, indexer });

  const tableViewData = convertProposalForTableView(call, chain);
  const jsonViewData = convertProposalForJsonView(call, chain);

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
    dataTableData = tableViewData;
  }

  return (
    <Wrapper>
      <HeaderWrapper>
        <Header className="text-textSecondary">{title}</Header>
        <TagWrapper>
          <span className="inline-flex gap-x-1">
            <ThemedTag>{call?.section}</ThemedTag>
            <ThemedTag>{call?.method}</ThemedTag>
          </span>

          <Tooltip content="Call Detail">
            <InfoDocs
              role="button"
              className={cn(
                "w-4 h-4 relative top-[0.5px]",
                "[&_path]:stroke-textTertiary [&_path]:hover:stroke-textSecondary",
                "[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary",
              )}
              onClick={() => setDetailPopupVisible(true)}
            />
          </Tooltip>
        </TagWrapper>
      </HeaderWrapper>

      {!!tableViewData?.args?.calls?.length && (
        <HeaderWrapper>
          <Header />
          <ProposalChildCalls calls={tableViewData?.args?.calls} />
        </HeaderWrapper>
      )}

      {detailPopupVisible && (
        <CallDetailPopup
          tableViewData={dataTableData}
          jsonViewData={jsonViewData}
          hasTreeViewData={!!preImageHash}
          rawCall={rawCall || call}
          isLoadingRawCall={isLoadingRawCall}
          setShow={setDetailPopupVisible}
        />
      )}
    </Wrapper>
  );
}

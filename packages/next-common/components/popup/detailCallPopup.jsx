"use client";

import Tab from "../tab";
import Popup from "./wrapper/Popup";
import { hexEllipsis, toPrecision } from "next-common/utils";
import { hexIsValidUTF8 } from "next-common/utils/utf8validate";
import { hexToString } from "@polkadot/util";
import getChainSettings from "next-common/utils/consts/settings";
import BigNumber from "bignumber.js";
import needCheckUtf8 from "../proposal/needCheckUtf8";
import InnerDataTable from "../table/innerDataTable";
import { useChain } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import clsx from "clsx";
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";
import LargeDataPlaceHolder from "../proposal/largeDataPlaceHolder";
import dynamic from "next/dynamic";
const JsonView = dynamic(
  () => import("../jsonView").catch((e) => console.error(e)),
  { ssr: false },
);
const LongText = dynamic(() => import("../longText"), {
  ssr: false,
});

export default function DetailCallPopup({
  onClose,
  call = {},
  shorten,
  proposalIndex,
  motionIndex,
  referendumIndex,
}) {
  const chain = useChain();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal;

  let tableData = {};
  if (shorten) {
    tableData = {
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
    tableData = convertProposalForTableView(call, chain);
  }

  const tabs = [
    {
      tabId: "table",
      tabTitle: "Table",
      content: <InnerDataTable data={tableData} />,
    },
    {
      tabId: "json",
      tabTitle: "JSON",
      content: <JsonView src={convertProposalForJsonView(call, chain)} />,
    },
  ];

  const [selectedTabId, setSelectedTabId] = useLocalStorage(
    "callType",
    tabs[0].tabId,
  );

  useEffect(() => {
    if (proposal?.shorten) {
      setSelectedTabId("table");
    }
  }, [proposal]);

  return (
    <Popup title="Call Detail" onClose={onClose} className="w-[650px]">
      <Tab
        tabs={tabs}
        selectedTabId={selectedTabId}
        setSelectedTabId={setSelectedTabId}
      />

      <div className="p-6 bg-neutral200 rounded-lg">
        {tabs.map((tab) => (
          <div
            key={tab.tabId}
            className={clsx(selectedTabId !== tab.tabId && "hidden")}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </Popup>
  );
}

function convertProposalForTableView(proposal, chain) {
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

function convertProposalForJsonView(proposal, chain) {
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

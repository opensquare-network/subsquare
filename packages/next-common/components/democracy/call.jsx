import { useDemocracyReferendumHash } from "next-common/hooks/democracy/useDemocracyReferendumHash";
import KvList from "../listInfo/kvList";
import Proposal from "../proposal";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import getChainSettings from "next-common/utils/consts/settings";
import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import React from "react";

function extractKintsugiFields(chain, call = {}) {
  if (![Chains.kintsugi, Chains.interlay].includes(chain)) {
    return [];
  }

  const { section, method, args = [] } = call;
  if ("democracy" !== section || "spendFromTreasury" !== method) {
    return [];
  }
  const value = args[0].value;
  const beneficiary = args[1].value;

  const { decimals, symbol } = getChainSettings(chain);

  return [
    ["Request", `${toPrecision(value, decimals)} ${symbol}`],
    [
      "Beneficiary",
      <User
        key="beneficiary"
        add={beneficiary}
        showAvatar={true}
        color="var(--sapphire500)"
      />,
    ],
  ];
}

export default function ReferendumCall({ call, shorten, onchainData = {} }) {
  const hash = useDemocracyReferendumHash();
  const chain = useChain();

  const data = [
    ["Hash", hash],
    [
      <Proposal
        key={"call"}
        call={call}
        shorten={shorten}
        referendumIndex={onchainData.referendumIndex}
      />,
    ],
    ...extractKintsugiFields(chain, call),
  ];

  return <KvList data={data} />;
}

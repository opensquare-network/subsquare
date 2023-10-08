import Chains from "next-common/utils/consts/chains";
import getChainSettings from "next-common/utils/consts/settings";
import { toPrecision } from "next-common/utils";
import React from "react";
import { hexIsValidUTF8 } from "next-common/utils/utf8validate";
import { hexToString } from "@polkadot/util";
import AddressUser from "next-common/components/user/addressUser";

function extractTreasuryFields(chain, call = {}) {
  const { section, method, args = [] } = call;
  if ("democracy" !== section || "spendFromTreasury" !== method) {
    return null;
  }
  const value = args[0].value;
  const beneficiary = args[1].value;

  const { decimals, symbol } = getChainSettings(chain);

  return [
    ["Request", `${toPrecision(value, decimals)} ${symbol}`],
    [
      "Beneficiary",
      <AddressUser
        key="beneficiary"
        add={beneficiary}
        color="var(--sapphire500)"
      />,
    ],
  ];
}

function extreactRemarkFields(call = {}) {
  const { section, method, args = [] } = call;
  if ("system" !== section || "remark" !== method) {
    return null;
  }
  let remark = args[0].value;
  if (hexIsValidUTF8(remark)) {
    remark = hexToString(remark);
  }

  return [
    [
      "Remark",
      <p className="whitespace-pre-wrap" key="remark">
        {remark}
      </p>,
    ],
  ];
}

export default function extractKintsugiFields(chain, call = {}) {
  if (![Chains.kintsugi, Chains.interlay].includes(chain)) {
    return [];
  }

  const treasuryFields = extractTreasuryFields(chain, call);
  if (treasuryFields) {
    return treasuryFields;
  }

  const remarkFields = extreactRemarkFields(call);
  if (remarkFields) {
    return remarkFields;
  }

  return [];
}

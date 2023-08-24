import Copyable from "next-common/components/copyable";
import React from "react";

export default function extractWhitelistCallHash(call = {}) {
  const { section, method, args = [] } = call;
  if ("whitelist" !== section || "whitelistCall" !== method) {
    return [];
  }

  const callHash = args[0].value;
  return [["Whitelist Call Hash", <Copyable key="hash">{callHash}</Copyable>]];
}

import AddressUser from "next-common/components/user/addressUser";
import React from "react";

export default function extractFellowshipApprove(call = {}) {
  const { section, method, args = [] } = call;
  if ("fellowshipCore" !== section || "approve" !== method) {
    return [];
  }

  const who = args[0].value;
  const atRank = args[1].value;
  return [
    ["Who", <AddressUser key="promotee" add={who} />],
    ["At Rank", atRank],
  ];
}

import React from "react";
import AddressUser from "next-common/components/user/addressUser";

export default function extractFellowshipPromote(call = {}) {
  const { section, method, args = [] } = call;
  if ("fellowshipCore" !== section || !["promote", "promoteFast"].includes(method)) {
    return [];
  }

  const who = args[0].value;
  const toRank = args[1].value;
  return [
    ["Promotee", <AddressUser key="promotee" add={who} />],
    ["To Rank", toRank],
  ];
}

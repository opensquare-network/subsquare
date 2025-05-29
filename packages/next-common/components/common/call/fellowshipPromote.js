import React from "react";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";

export default function extractFellowshipPromote(call = {}) {
  const { section, method, args = [] } = call;
  if (
    "fellowshipCore" !== section ||
    !["promote", "promoteFast"].includes(method)
  ) {
    return [];
  }

  const who = args[0].value;
  const toRank = args[1].value;
  return [
    [
      method === "promote" ? "Promotion" : "Fast Promotion",
      <>
        <AddressUser key="promotee" add={who} />
        <span className="px-2">to</span>
        <FellowshipRank rank={toRank} />
      </>,
    ],
  ];
}

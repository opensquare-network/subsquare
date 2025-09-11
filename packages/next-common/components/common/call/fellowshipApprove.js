import AddressUser from "next-common/components/user/addressUser";
import React from "react";
import FellowshipRank from "next-common/components/fellowship/rank";

export default function extractFellowshipApprove(call = {}) {
  const { section, method, args = [] } = call;
  if ("fellowshipCore" !== section || "approve" !== method) {
    return [];
  }

  const who = args[0].value;
  const atRank = args[1].value;
  return [
    [
      "Retention",
      <>
        <AddressUser key="promotee" add={who} />
        <span className="mx-2">at</span>
        <FellowshipRank rank={atRank} />
      </>,
    ],
  ];
}

import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import ApproveFellowshipMemberPopup from "next-common/components/summary/newProposalQuickStart/ApproveFellowshipMemberPopup";

export default function Approve({ member }) {
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const address = useRealAddress();

  const members = useSelector(fellowshipCoreMembersSelector);
  const me = members.find((m) => m.address === address);
  const myRankOk = me && me.rank >= 3;

  if (!myRankOk) {
    let tipContent = "Only available to the members with rank >= 3";
    return (
      <Tooltip content={tipContent}>
        <span className="text14Medium text-textDisabled">Approve</span>
      </Tooltip>
    );
  }

  return (
    <>
      <span
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowApprovePopup(true)}
      >
        Approve
      </span>
      {showApprovePopup && (
        <ApproveFellowshipMemberPopup
          member={member}
          onClose={() => setShowApprovePopup(false)}
        />
      )}
    </>
  );
}

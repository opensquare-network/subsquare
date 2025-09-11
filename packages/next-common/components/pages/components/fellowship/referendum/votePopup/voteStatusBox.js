import React from "react";

import { StatusWrapper } from "next-common/components/popup/styled";
import ApproveIcon from "next-common/assets/imgs/icons/approve.svg";
import RejectIcon from "next-common/assets/imgs/icons/reject.svg";

export default function VoteStatusBox({ children, aye, nay }) {
  return (
    <StatusWrapper>
      <div className="value">{children}</div>
      {aye ? (
        <div className="result">
          Aye ({aye})
          <ApproveIcon />
        </div>
      ) : (
        <div className="result">
          Nay ({nay})
          <RejectIcon />
        </div>
      )}
    </StatusWrapper>
  );
}

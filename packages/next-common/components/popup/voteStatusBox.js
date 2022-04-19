import React from "react";

import { StatusWrapper } from "./styled";
import ApproveIcon from "next-common/assets/imgs/icons/approve.svg";
import RejectIcon from "next-common/assets/imgs/icons/reject.svg";

export default function VoteStatusBox({ children, aye }) {
  return (
    <StatusWrapper>
      <div className="value">{children}</div>
      {aye ? (
        <div className="result">
          Aye
          <ApproveIcon />
        </div>
      ) : (
        <div className="result">
          Nay
          <RejectIcon />
        </div>
      )}
    </StatusWrapper>
  );
}

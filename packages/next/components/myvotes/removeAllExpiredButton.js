import { SystemClose } from "@osn/icons/subsquare";
import { useState } from "react";
import RemoveReferendumVotePopup from "./removeReferendumVotePopup";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";
import { useDispatch } from "react-redux";

export default function RemoveAllExpiredButton({ votes }) {
  const dispatch = useDispatch();
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  return (
    <>
      <div
        className="flex cursor-pointer bg-neutral100 rounded-[4px] border border-neutral400 text-[12px] items-center pr-[12px]"
        onClick={() => setShowRemovePopup(true)}
      >
        <SystemClose width={16} height={16} className="m-[6px]" />
        <span>Remove All Expired</span>
      </div>
      {showRemovePopup && (
        <RemoveReferendumVotePopup
          votes={votes}
          onClose={() => setShowRemovePopup(false)}
          onInBlock={() => dispatch(incMyVotesTrigger())}
        />
      )}
    </>
  );
}

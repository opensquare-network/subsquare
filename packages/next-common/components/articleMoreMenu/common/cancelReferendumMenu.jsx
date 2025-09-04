import { noop } from "lodash-es";
import CancelReferendumPopup from "next-common/components/summary/newProposalQuickStart/cancelReferendumInnerPopup";
import { usePost } from "next-common/context/post";
import { useState } from "react";
import { CancelReferendumMenuItem } from "./menuItems";

export default function CancelReferendumMenu({ setShow = noop }) {
  const post = usePost();

  const [showCancelReferendumPopup, setShowCancelReferendumPopup] =
    useState(false);
  return (
    <div>
      <CancelReferendumMenuItem
        setShowCancelReferendumPopup={setShowCancelReferendumPopup}
        setShow={setShow}
      />
      {showCancelReferendumPopup && (
        <CancelReferendumPopup
          referendumIndex={post?.referendumIndex}
          onClose={() => setShowCancelReferendumPopup(false)}
        />
      )}
    </div>
  );
}

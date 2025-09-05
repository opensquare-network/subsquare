import KillReferendumPopup from "next-common/components/summary/newProposalQuickStart/killReferendumInnerPopup";
import { noop } from "lodash-es";
import { usePost } from "next-common/context/post";
import { useState } from "react";
import { KillReferendumMenuItem } from "./menuItems";

export default function KillReferendumMenu({ setShow = noop }) {
  const post = usePost();
  const [showKillReferendumPopup, setShowKillReferendumPopup] = useState(false);

  return (
    <div>
      <KillReferendumMenuItem
        setShowKillReferendumPopup={setShowKillReferendumPopup}
        setShow={setShow}
      />
      {showKillReferendumPopup && (
        <KillReferendumPopup
          referendumIndex={post?.referendumIndex}
          onClose={() => setShowKillReferendumPopup(false)}
        />
      )}
    </div>
  );
}

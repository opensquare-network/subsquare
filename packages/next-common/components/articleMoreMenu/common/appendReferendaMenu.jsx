import dynamicPopup from "next-common/lib/dynamic/popup";
import ReferendaAppendMenuItem from "next-common/components/appendants/referenda/appendMenuItem";
import { useState } from "react";

const ReferendaCreateAppendantPopup = dynamicPopup(() =>
  import("next-common/components/appendants/referenda/createPopup"),
);

export default function AppendReferendaMenu({ setShow }) {
  const [showReferendaCreatePopup, setShowReferendaCreatePopup] =
    useState(false);
  return (
    <div>
      <ReferendaAppendMenuItem
        setShow={setShow}
        setIsAppend={setShowReferendaCreatePopup}
      />
      {showReferendaCreatePopup && (
        <ReferendaCreateAppendantPopup
          setIsAppend={setShowReferendaCreatePopup}
        />
      )}
    </div>
  );
}

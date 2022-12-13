import React from "react";
import { useState } from "react";
import { Button } from "next-common/components/summary/styled";
import StackPopup from "next-common/components/democracy/delegatePopup";

export default function DemocracySummaryStackButton({ onStackInBlock }) {
  const [showStackPopup, setShowStackPopup] = useState(false);

  return (
    <>
      <Button onClick={() => setShowStackPopup(true)}>Stack</Button>
      {showStackPopup && (
        <StackPopup
          onInBlock={onStackInBlock}
          onClose={() => setShowStackPopup(false)}
        />
      )}
    </>
  );
}

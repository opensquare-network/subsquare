import React from "react";
import ConvictionField from "next-common/components/popup/fields/convictionField";

export default function DemocracyConviction({
  balance,
  conviction,
  setConviction,
}) {
  return (
    <ConvictionField
      balance={balance}
      conviction={conviction}
      setConviction={setConviction}
      module="democracy"
    />
  );
}

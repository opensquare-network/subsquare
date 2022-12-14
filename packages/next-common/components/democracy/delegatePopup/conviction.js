import React from "react";
import ConvictionField from "next-common/components/popup/fields/convictionField";

export default function DemocracyConviction({ conviction, setConviction }) {
  return (
    <ConvictionField
      conviction={conviction}
      setConviction={setConviction}
      module="democracy"
    />
  );
}

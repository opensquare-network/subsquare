import React from "react";
import Summary from "./summary";

export default function MemberSummary({ fellow, ally, retiring }) {
  return (
    <Summary
      description="Alliance members by role."
      items={[
        { title: "Fellow", content: fellow || 0 },
        { title: "Ally", content: ally || 0 },
        { title: "Retiring", content: retiring || 0 },
      ]}
    />
  );
}

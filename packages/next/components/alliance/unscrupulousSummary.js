import React from "react";
import Summary from "next-common/components/summary";

export default function UnscrupulousSummary({ accounts, websites }) {
  return (
    <Summary
      items={[
        { title: "Accounts", content: accounts || 0 },
        { title: "Websites", content: websites || 0 },
      ]}
    />
  );
}

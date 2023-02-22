import React from "react";
import Summary from "./summary";

export default function UnscrupulousSummary({ accounts, websites }) {
  return (
    <Summary
      description="The current list of accounts/websites deemed unscrupulous."
      items={[
        { title: "Accounts", content: accounts || 0 },
        { title: "Websites", content: websites || 0 },
      ]}
    />
  );
}

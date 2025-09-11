import Tab from "next-common/components/tab";
import React from "react";

export const WASM = "Wasm";
export const EVM = "Evm";

export default function ContractTypeTab({ tabIndex, setTabIndex }) {
  return (
    <Tab
      tabs={[
        {
          tabId: EVM,
          tabTitle: "EVM Contract",
        },
        {
          tabId: WASM,
          tabTitle: "Wasm Contract",
        },
      ]}
      selectedTabId={tabIndex}
      setSelectedTabId={setTabIndex}
    />
  );
}

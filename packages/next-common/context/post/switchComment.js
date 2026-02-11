import { EmptyList } from "next-common/utils/constants";
import React, { useState } from "react";

const SwitchCommentContext = React.createContext();

export function SwitchCommentProvider({ children, switchTabs = [] }) {
  const [activeTab, setActiveTab] = useState(switchTabs?.[0]?.tabId);

  return (
    <SwitchCommentContext.Provider
      value={{ switchTabs, activeTab, setActiveTab }}
    >
      {children}
    </SwitchCommentContext.Provider>
  );
}

export function useSwitchCommentList() {
  const { switchTabs, activeTab } =
    React.useContext(SwitchCommentContext) || {};

  return (
    switchTabs.find((tab) => tab.tabId === activeTab)?.comments || EmptyList
  );
}

export function useSwitchCommentChangeActiveTab() {
  const { setActiveTab } = React.useContext(SwitchCommentContext) || {};

  return setActiveTab;
}

export function useSwitchCommentTabs() {
  const { switchTabs, activeTab, setActiveTab } =
    React.useContext(SwitchCommentContext) || {};

  return { switchTabs, activeTab, setActiveTab };
}

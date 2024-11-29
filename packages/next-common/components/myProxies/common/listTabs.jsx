import MyProxies from "../myProxies";
import ReceivedProxies from "../received";
import { useState, useMemo } from "react";
import { useMyProxiesContext } from "../context/myProxies";
import { useReceivedProxiesContext } from "../context/received";
import { cn } from "next-common/utils";

export default function ProxyListTabs() {
  const { total: myProxiesCount, loading: isMyProxiesLoading } =
    useMyProxiesContext();
  const { total: receivedProxiesCount, loading: isReceivedProxiesLoading } =
    useReceivedProxiesContext();

  const [activeTab, setActiveTab] = useState("mine");

  const tabs = useMemo(
    () => [
      {
        key: "mine",
        name: (
          <div className="inline-flex items-center space-x-1 ml-6">
            <span>My Proxies</span>
            {!isMyProxiesLoading && (
              <span className="text16Medium text-textTertiary">
                {myProxiesCount}
              </span>
            )}
          </div>
        ),
        content: <MyProxies />,
      },
      {
        key: "received",
        name: (
          <div className="inline-flex items-center space-x-1">
            <span>Received</span>
            {!isReceivedProxiesLoading && (
              <span className="text16Medium text-textTertiary">
                {receivedProxiesCount}
              </span>
            )}
          </div>
        ),
        content: <ReceivedProxies />,
      },
    ],
    [
      myProxiesCount,
      isMyProxiesLoading,
      receivedProxiesCount,
      isReceivedProxiesLoading,
    ],
  );

  return (
    <div>
      <div className="flex gap-x-6 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={cn(
              "text16Bold",
              activeTab === tab.key ? "text-textPrimary" : "text-textTertiary",
            )}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div>{tabs.find((tab) => tab.key === activeTab)?.content}</div>
    </div>
  );
}

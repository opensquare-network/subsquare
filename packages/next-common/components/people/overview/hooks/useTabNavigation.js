import { useState } from "react";
import { useRouter } from "next/router";

export default function useTabNavigation(defaultTab = "identity") {
  const router = useRouter();
  const [activeTabValue, setActiveTabValue] = useState(
    router.query.tab || defaultTab,
  );

  const handleTabClick = (tab) => {
    setActiveTabValue(tab.value);
    router.replace(
      {
        query: {
          tab: tab.value,
        },
      },
      null,
      { shallow: true },
    );
  };

  return {
    activeTabValue,
    handleTabClick,
  };
}

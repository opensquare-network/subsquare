import { useState } from "react";
import TabsList from "../tabs/list";
import NewsLayout from "./common/newsLayout";
import ReviewNewsListPage from "./common/reviewNewsListPage";
import NewsPage from "./common/newsPage";

export default function NewsManagementPage() {
  const [activeTabValue, setActiveTabValue] = useState("news");
  const tabs = [
    {
      value: "news",
      label: "News",
      active: activeTabValue === "news",
      url: "/news/management?type=news",
      exactMatch: false,
    },
    {
      value: "review-news",
      label: "Review News",
      active: activeTabValue === "review-news",
      url: "/news/management?type=review-news",
      exactMatch: false,
    },
  ];

  return (
    <NewsLayout>
      <TabsList
        activeTabValue={activeTabValue}
        tabs={tabs}
        onTabClick={(item) => {
          setActiveTabValue(item.value);
        }}
      />
      {activeTabValue === "review-news" ? <ReviewNewsListPage /> : <NewsPage />}
    </NewsLayout>
  );
}

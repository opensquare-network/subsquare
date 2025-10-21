import { useMemo } from "react";
import TabsList from "../tabs/list";
import { useRouter } from "next/router";
import NewsPage from "./common/newsPage";
import NewsLayout from "./common/newsLayout";
import ReviewNewsListPage from "./common/reviewNewsListPage";

export default function NewsManagementPage() {
  const router = useRouter();

  const { tabs, activeTabValue } = useMemo(() => {
    let activeTabValue = router.query.type;
    if (!["news", "review-news"].includes(router.query.type)) {
      activeTabValue = "news";
    }
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
    return {
      tabs,
      activeTabValue,
    };
  }, [router.query.type]);

  return (
    <NewsLayout>
      <TabsList activeTabValue={activeTabValue} tabs={tabs} />
      {activeTabValue === "review-news" ? <ReviewNewsListPage /> : <NewsPage />}
    </NewsLayout>
  );
}

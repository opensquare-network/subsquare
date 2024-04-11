import { usePageProps } from "next-common/context/page";
import TabsList from "../tabs/tabsList";

export default function WhalesTabs() {
  const { whales, historyWhales } = usePageProps();

  return (
    <TabsList
      isUrlTabs
      tabs={[
        {
          label: "Current",
          url: "/referenda/whales",
          activeCount: whales?.total || 0,
        },
        {
          label: "History",
          url: "/referenda/whales/history",
          activeCount: historyWhales?.total || 0,
        },
      ]}
    />
  );
}

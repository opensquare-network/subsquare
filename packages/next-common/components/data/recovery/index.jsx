import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import TabsList from "next-common/components/tabs/list";
import { TabLabel } from "next-common/components/assethubMigrationAssets/tabs";
import PageHeader from "../common/pageHeader";
import RecoveryFriendGroupsTable from "./table";
import RecoveryAttemptsTable from "./table/attempts";
import useQueryAllRecoveryData, {
  flattenRecoveryData,
} from "./hooks/useQueryAllRecoveryData";
import useQueryAllRecoveryAttempts from "./hooks/useQueryAllRecoveryAttempts";
import { searchAddress } from "./table";

export default function RecoveryExplorer() {
  const [activeTab, setActiveTab] = useState("friendGroups");
  const router = useRouter();
  const search = router.query.search || "";

  const { data: friendGroupsData, loading: friendGroupsLoading } =
    useQueryAllRecoveryData();
  const { data: attemptsData, loading: attemptsLoading } =
    useQueryAllRecoveryAttempts();

  const flattened = useMemo(
    () => flattenRecoveryData(friendGroupsData),
    [friendGroupsData],
  );
  const filteredFlattened = useMemo(
    () => searchAddress(flattened, search),
    [flattened, search],
  );
  const friendGroupsTotal = filteredFlattened.length;
  const attemptsTotal = attemptsData?.length || 0;

  const tabs = [
    {
      value: "friendGroups",
      label: (
        <TabLabel
          label="Friend Groups"
          count={friendGroupsTotal}
          isActive={activeTab === "friendGroups"}
        />
      ),
    },
    {
      value: "attempts",
      label: (
        <TabLabel
          label="Recovery Attempts"
          count={attemptsTotal}
          isActive={activeTab === "attempts"}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader />
      <div className="flex w-full mb-4">
        <TabsList
          tabs={tabs}
          activeTabValue={activeTab}
          onTabClick={(tab) => setActiveTab(tab.value)}
        />
      </div>
      {activeTab === "friendGroups" ? (
        <RecoveryFriendGroupsTable
          data={friendGroupsData}
          loading={friendGroupsLoading}
        />
      ) : (
        <RecoveryAttemptsTable data={attemptsData} loading={attemptsLoading} />
      )}
    </>
  );
}

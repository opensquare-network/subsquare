import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import TabsList from "next-common/components/tabs/list";
import { TabLabel } from "next-common/components/assethubMigrationAssets/tabs";
import Loading from "next-common/components/loading";
import PageHeader from "../common/pageHeader";
import RecoveryFriendGroupsTable from "./table";
import RecoveryAttemptsTable from "./table/attempts";
import RecoveryInheritorsTable from "./table/inheritors";
import useQueryAllFriendGroups, {
  flattenRecoveryData,
} from "./hooks/useQueryAllFriendGroups";
import useQueryAllRecoveryAttempts from "./hooks/useQueryAllRecoveryAttempts";
import useQueryAllRecoveryInheritors from "./hooks/useQueryAllRecoveryInheritors";
import { searchAddress } from "./table";
import { addRouterQuery } from "next-common/utils/router";

export default function RecoveryExplorer() {
  const [activeTab, setActiveTab] = useState("inheritors");
  const router = useRouter();
  const search = router.query.search || "";

  const { data: friendGroupsData, loading: friendGroupsLoading } =
    useQueryAllFriendGroups();
  const { data: attemptsData, loading: attemptsLoading } =
    useQueryAllRecoveryAttempts();
  const { data: inheritorsData, loading: inheritorsLoading } =
    useQueryAllRecoveryInheritors();

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
  const inheritorsTotal = inheritorsData?.length || 0;

  const tabs = [
    {
      value: "inheritors",
      label: (
        <TabLabel
          label="Inheritors"
          count={inheritorsLoading ? <Loading size={14} /> : inheritorsTotal}
          isActive={activeTab === "inheritors"}
        />
      ),
    },
    {
      value: "friendGroups",
      label: (
        <TabLabel
          label="Friend Groups"
          count={
            friendGroupsLoading ? <Loading size={14} /> : friendGroupsTotal
          }
          isActive={activeTab === "friendGroups"}
        />
      ),
    },
    {
      value: "attempts",
      label: (
        <TabLabel
          label="Recovery Attempts"
          count={attemptsLoading ? <Loading size={14} /> : attemptsTotal}
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
          onTabClick={(tab) => {
            setActiveTab(tab.value);
            addRouterQuery(router, "page", 1);
          }}
        />
      </div>
      {activeTab === "friendGroups" ? (
        <RecoveryFriendGroupsTable
          data={friendGroupsData}
          loading={friendGroupsLoading}
        />
      ) : activeTab === "attempts" ? (
        <RecoveryAttemptsTable
          data={attemptsData}
          loading={attemptsLoading}
          friendGroups={friendGroupsData}
        />
      ) : (
        <RecoveryInheritorsTable
          data={inheritorsData}
          loading={inheritorsLoading}
        />
      )}
    </>
  );
}

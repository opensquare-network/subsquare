import MultisigsList from "./multisigsList";
import AccountSubTabs from "next-common/components/overview/account/subTabs";
import WithPageWidth from "next-common/components/common/withPageWidth";
import { CallPopupProvider } from "./context/callPopupContext";
import { SignSubmitPopupProvider } from "./context/signSubmitPopupContext";
import Tabs from "next-common/components/tabs";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import { useRouter } from "next/router";
import { AccountsTitle, HistoryTitle } from "./styled";
import { MultisigAccountsProvider } from "./context/multisigAccountsContext";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const MultisigAccountsList = dynamic(() => import("./multisigAccountsList"), {
  ssr: false,
});

export default function Multisigs() {
  const realAddress = useRealAddress();
  const router = useRouter();
  const tabs = useMemo(() => {
    return [
      {
        value: "history",
        label: ({ active }) => <HistoryTitle active={active} />,
        content: <MultisigsList />,
      },
      {
        value: "accounts",
        label: ({ active }) => <AccountsTitle active={active} />,
        content: <MultisigAccountsList />,
      },
    ];
  }, []);

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  useEffect(() => {
    setActiveTabValue(router.query.tab || tabs[0].value);
  }, [router.query.tab, tabs]);

  const onTabClick = useCallback(
    (tab) => {
      setActiveTabValue(tab.value);
      router.replace(
        {
          query: {
            tab: tab.value,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-[16px]">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-[12px]">
          <AccountSubTabs className="mx-6" />
        </div>
        <WithPageWidth>
          <CallPopupProvider>
            <SignSubmitPopupProvider>
              <NeutralPanel className="p-6">
                <MultisigAccountsProvider userAddress={realAddress}>
                  <Tabs
                    tabs={tabs}
                    activeTabValue={activeTabValue}
                    onTabClick={onTabClick}
                  />
                </MultisigAccountsProvider>
              </NeutralPanel>
            </SignSubmitPopupProvider>
          </CallPopupProvider>
        </WithPageWidth>
      </div>
    </div>
  );
}

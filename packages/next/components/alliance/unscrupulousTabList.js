import { useState } from "react";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import UnscrupulousAccounts from "./unscrupulousAccounts";
import UnscrupulousWebsites from "./unscrupulousWebsites";
import Tabs from "./tabs";
import styled, { css } from "styled-components";

const TabName = {
  Accounts: "Accounts",
  Websites: "Websites",
};

const ListWrapper = styled.div`
  margin: 16px 0;
`;

const TabTitle = styled(TitleContainer)`
  ${(p) =>
    p.active
      ? css`
          color: ${p.theme.textPrimary};
        `
      : css`
          color: ${p.theme.textTertiary};
        `}
`;

export default function UnscrupulousTabList({
  accounts,
  isAccountsLoading,
  websites,
  isWebsitesLoading,
}) {
  const [activeTab, setActiveTab] = useState(TabName.Accounts);
  const tabs = [
    {
      value: TabName.Accounts,
      content: (
        <TabTitle active={activeTab === TabName.Accounts}>Accounts</TabTitle>
      ),
    },
    {
      value: TabName.Websites,
      content: (
        <TabTitle active={activeTab === TabName.Websites}>Websites</TabTitle>
      ),
    },
  ];

  let list = null;
  if (activeTab === TabName.Accounts) {
    list = (
      <UnscrupulousAccounts
        items={accounts || []}
        loading={isAccountsLoading}
      />
    );
  } else if (activeTab === TabName.Websites) {
    list = (
      <UnscrupulousWebsites
        items={websites || []}
        loading={isWebsitesLoading}
      />
    );
  }

  return (
    <>
      <Tabs tabs={tabs} setActiveTab={setActiveTab} />
      <ListWrapper>{list}</ListWrapper>
    </>
  );
}

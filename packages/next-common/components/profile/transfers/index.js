import { useChain, useChainSettings } from "next-common/context/chain";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useEffect, useState } from "react";
import TransferList from "./list";
import Pagination from "next-common/components/pagination";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import {
  profileTransfersSelector,
  setProfileTransfers,
} from "next-common/store/reducers/profile/transfer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useMountedState } from "react-use";
import { getStatescanDomain } from "next-common/utils/statescan";
import Tabs from "next-common/components/tabs";
import { TabTitle } from "next-common/components/profile/tabs";

const DEFAULT_PAGE_SIZE = 25;

function RelayTransferContent() {
  const dispatch = useDispatch();
  const chain = useChain();
  const address = useProfileAddress();
  const transfers = useSelector(profileTransfersSelector);
  const [page, setPage] = useState(1);
  const isMounted = useMountedState();
  const domain = getStatescanDomain(chain);

  useEffect(() => {
    if (!address) {
      return;
    }

    fetch(
      `https://${domain}-api.statescan.io/accounts/${address}/transfers?page=${
        page - 1
      }&page_size=${DEFAULT_PAGE_SIZE}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        if (isMounted()) {
          dispatch(setProfileTransfers(result));
        }
      })
      .catch((error) => console.error(error));
  }, [address, domain, page, isMounted, dispatch]);

  return (
    <>
      <TransferList isLoading={!transfers} items={transfers?.items} />
      <Pagination
        page={page}
        pageSize={transfers?.pageSize}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          setPage(page);
        }}
        total={transfers?.total || 0}
      />
    </>
  );
}

function AssetHubTransferContent({ assethubMigration }) {
  const address = useProfileAddress();
  const [transfers, setTransfers] = useState(null);
  const [page, setPage] = useState(1);
  const isMounted = useMountedState();

  useEffect(() => {
    if (!address) {
      return;
    }

    const apiDomain = assethubMigration.statescanApiDomain;
    fetch(
      `https://${apiDomain}-api.statescan.io/accounts/${address}/transfers?page=${
        page - 1
      }&page_size=${DEFAULT_PAGE_SIZE}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        if (isMounted()) {
          setTransfers(result);
        }
      })
      .catch((error) => console.error(error));
  }, [address, assethubMigration, page, isMounted]);

  return (
    <>
      <TransferList
        isLoading={!transfers}
        items={transfers?.items}
        statescanDomain={assethubMigration.statescanAssethubDomain}
      />
      <Pagination
        page={page}
        pageSize={transfers?.pageSize}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          setPage(page);
        }}
        total={transfers?.total || 0}
      />
    </>
  );
}

export default function ProfileTransfers() {
  const { assethubMigration } = useChainSettings();
  const [activeTab, setActiveTab] = useState("relay");

  if (!assethubMigration) {
    return (
      <SecondaryCard>
        <RelayTransferContent />
      </SecondaryCard>
    );
  }

  return (
    <SecondaryCard>
      <Tabs
        activeTabValue={activeTab}
        onTabClick={(tab) => setActiveTab(tab.value)}
        tabs={[
          {
            value: "relay",
            label({ active }) {
              return <TabTitle active={active}>Relay</TabTitle>;
            },
            content: <RelayTransferContent />,
          },
          {
            value: "assethub",
            label({ active }) {
              return <TabTitle active={active}>AssetHub</TabTitle>;
            },
            content: (
              <AssetHubTransferContent assethubMigration={assethubMigration} />
            ),
            lazy: true,
          },
        ]}
        tabsListDivider={false}
        tabsListClassName="ml-6 mb-4"
      />
    </SecondaryCard>
  );
}

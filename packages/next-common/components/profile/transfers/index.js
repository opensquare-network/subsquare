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
import Loading from "next-common/components/loading";

const DEFAULT_PAGE_SIZE = 25;

function TabLabel({ active, children, count }) {
  return (
    <span
      className={`cursor-pointer font-bold text-[16px] leading-6 ${
        active ? "text-textPrimary" : "text-textTertiary"
      }`}
    >
      {children}
      <span className="ml-1 font-medium text-[16px] leading-6 text-textTertiary">
        {count == null ? <Loading size={16} /> : count}
      </span>
    </span>
  );
}

function RelayTransferContent({ onTotalChange }) {
  const dispatch = useDispatch();
  const chain = useChain();
  const address = useProfileAddress();
  const transfers = useSelector(profileTransfersSelector);
  const [page, setPage] = useState(1);
  const isMounted = useMountedState();
  const domain = getStatescanDomain(chain);

  useEffect(() => {
    onTotalChange?.(transfers?.total ?? null);
  }, [transfers?.total, onTotalChange]);

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

function AssetHubTransferContent({ assethubMigration, onTotalChange }) {
  const address = useProfileAddress();
  const [transfers, setTransfers] = useState(null);
  const [page, setPage] = useState(1);
  const isMounted = useMountedState();

  useEffect(() => {
    onTotalChange?.(transfers?.total ?? null);
  }, [transfers?.total, onTotalChange]);

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
  const [activeTab, setActiveTab] = useState("assethub");
  const [relayTotal, setRelayTotal] = useState(null);
  const [assethubTotal, setAssethubTotal] = useState(null);

  if (!assethubMigration?.statescanApiDomain) {
    return (
      <SecondaryCard>
        <RelayTransferContent />
      </SecondaryCard>
    );
  }

  return (
    <Tabs
      activeTabValue={activeTab}
      onTabClick={(tab) => setActiveTab(tab.value)}
      tabs={[
        {
          value: "assethub",
          label({ active }) {
            return (
              <TabLabel active={active} count={assethubTotal}>
                AssetHub
              </TabLabel>
            );
          },
          content: (
            <SecondaryCard>
              <AssetHubTransferContent
                assethubMigration={assethubMigration}
                onTotalChange={setAssethubTotal}
              />
            </SecondaryCard>
          ),
        },
        {
          value: "relay",
          label({ active }) {
            return (
              <TabLabel active={active} count={relayTotal}>
                Relay
              </TabLabel>
            );
          },
          content: (
            <SecondaryCard>
              <RelayTransferContent onTotalChange={setRelayTotal} />
            </SecondaryCard>
          ),
        },
      ]}
      tabsListDivider={false}
      tabsListClassName="ml-6 mb-4"
    />
  );
}

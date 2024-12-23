import { useChainSettings } from "next-common/context/chain";
import { fetchIdentity } from "next-common/services/identity";
import { getIdentityDisplay } from "next-common/utils/identity";
import { useEffect, useMemo, useState } from "react";
import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";
import { SystemSearch } from "@osn/icons/subsquare";
import styled from "styled-components";
import { noop } from "lodash-es";

async function fetchBatchIdentities(identityChain, accounts = []) {
  const results = await Promise.all(
    accounts.map(async (account) => {
      const identity = await fetchIdentity(identityChain, account);
      const display = getIdentityDisplay(identity);
      return { account, display: display?.toLowerCase() || null };
    }),
  );
  return results.reduce((acc, { account, display }) => {
    if (display) acc[account] = display;
    return acc;
  }, {});
}

export default function useSearchByAddressIdentity(
  identitySearchInput,
  fromAccounts = [],
) {
  const router = useRouter();
  const [identityMapping, setIdentityMapping] = useState({});
  const { identity: identityChain } = useChainSettings();

  useEffect(() => {
    const allAccounts = new Set();
    fromAccounts.forEach(({ delegator, items }) => {
      allAccounts.add(delegator);
      items.forEach(({ delegatee }) => allAccounts.add(delegatee));
    });

    const accountList = Array.from(allAccounts);

    const fetchIdentities = async () => {
      const identities = await fetchBatchIdentities(identityChain, accountList);
      setIdentityMapping(identities);
    };

    fetchIdentities();
  }, [fromAccounts, identityChain]);

  useEffect(() => {
    const querySearch = getRouterQuery(router, "search");
    if (identitySearchInput !== querySearch) {
      if (identitySearchInput) {
        addRouterQuery(router, "search", identitySearchInput);
      } else {
        removeRouterQuery(router, "search");
      }
    }
  }, [identitySearchInput, router]);

  return useMemo(() => {
    const search = (identitySearchInput || "").toLowerCase();

    if (!search) {
      return fromAccounts;
    }

    return fromAccounts.filter(({ delegator, items }) => {
      const addressMatch =
        delegator.toLowerCase().includes(search) ||
        items.some(({ delegatee }) => delegatee.toLowerCase().includes(search));

      const identityMatch =
        identityMapping[delegator]?.includes(search) ||
        items.some(({ delegatee }) =>
          identityMapping[delegatee]?.includes(search),
        );

      return addressMatch || identityMatch;
    });
  }, [identitySearchInput, fromAccounts, identityMapping]);
}

const Wrapper = styled.div`
  margin: 24px 0 !important;
  display: flex;
  border-radius: 8px;
  border: 1px solid var(--neutral400);
  background: var(--neutral100);
`;

const Input = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  background: transparent;

  color: var(--textPrimary);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
`;

export function SearchBox({ setSearch = noop }) {
  return (
    <Wrapper>
      <div className="flex p-[8px] [&_path]:fill-textTertiary">
        <SystemSearch width={24} height={24} />
      </div>
      <Input
        placeholder="Search by identity name or address"
        onChange={(e) => setSearch(e.target.value)}
      />
    </Wrapper>
  );
}

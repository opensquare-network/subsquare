import { useState, useCallback, useEffect } from "react";
import { getIdentityDisplay } from "next-common/utils/identity";
import { fetchIdentity } from "next-common/services/identity";
import { useContextApi } from "next-common/context/api";
import { useAsync } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import { Deferred } from "next-common/utils/deferred";

function useFellowshipMembers() {
  const api = useContextApi();
  return useAsync(async () => {
    if (!api || !api.query.fellowshipCollective) {
      return null;
    }

    try {
      const fellowshipMembers =
        await api?.query.fellowshipCollective.members.entries();
      return fellowshipMembers.map(
        ([
          {
            args: [account],
          },
          info,
        ]) => ({
          address: account.toString(),
          rank: info.unwrap()?.rank.toNumber(),
        }),
      );
    } catch (e) {
      return null;
    }
  }, [api]);
}

function useFellowshipMembersWithIdentity() {
  const { identity: identityChain } = useChainSettings();
  const { value: fellowshipMembers, loading } = useFellowshipMembers();
  return useAsync(async () => {
    if (loading) {
      return null;
    }
    if (!fellowshipMembers) {
      return null;
    }
    return await Promise.all(
      fellowshipMembers.map(async (member) => {
        const identity = await fetchIdentity(identityChain, member.address);
        const name = getIdentityDisplay(identity);
        return {
          ...member,
          name,
        };
      }),
    );
  }, [identityChain, fellowshipMembers, loading]);
}

function searchFromMembers(members, text) {
  if (!members || !text || text.length < 3) {
    return [];
  }

  // filter members where contains text in address or name
  return members.filter(
    (member) =>
      member.address.toLowerCase().includes(text.toLowerCase()) ||
      (member.name ?? "").toLowerCase().includes(text.toLowerCase()),
  );
}

export default function useSearchFellowshipMembers() {
  const [isLoading, setIsLoading] = useState(false);
  const { value: fellowshipMembers, loading: isFellowshipMembersLoading } =
    useFellowshipMembersWithIdentity();

  const [dataDeferred] = useState(new Deferred());

  useEffect(() => {
    if (isFellowshipMembersLoading || !fellowshipMembers) {
      return;
    }
    dataDeferred.resolve(fellowshipMembers);
  }, [fellowshipMembers, isFellowshipMembersLoading, dataDeferred]);

  const search = useCallback(
    async (searchValue) => {
      setIsLoading(true);
      try {
        const fellowshipMembers = await dataDeferred.promise;
        return searchFromMembers(fellowshipMembers, searchValue);
      } finally {
        setIsLoading(false);
      }
    },
    [dataDeferred],
  );

  return {
    search,
    isLoading,
  };
}

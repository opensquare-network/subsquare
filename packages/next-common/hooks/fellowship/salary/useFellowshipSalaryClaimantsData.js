import { find, orderBy } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { usePageProps } from "next-common/context/page";
import { useState } from "react";

export function useFellowSalaryClaimantsData() {
  const { fellowshipSalaryClaimants = [], fellowshipMembers = [] } =
    usePageProps();
  const api = useContextApi();

  const [raw, setData] = useState(fellowshipSalaryClaimants);

  const data = orderBy(
    raw.map((claimant) => {
      const address = claimant?.address;
      const member = find(fellowshipMembers, { address });
      const rank = member?.rank;

      return {
        rank,
        ...claimant,
      };
    }),
    "rank",
    "desc",
  );

  async function fetcher() {
    const entries = await api.query?.fellowshipSalary?.claimants?.entries?.();
    const members = entries.map(([storageKey, record]) => {
      const address = storageKey.args[0].toString();
      const status = record.toJSON();

      return {
        address,
        status,
      };
    });

    setData(members);
  }

  return [data, fetcher];
}

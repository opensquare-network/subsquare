import { find, orderBy } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { fellowshipSalaryClaimantsSelector } from "next-common/store/reducers/fellowship/claimants";
import { useSelector } from "react-redux";

export function useFellowSalaryClaimantsData() {
  const {
    fellowshipSalaryClaimants: claimantsFromServer = [],
    fellowshipMembers = [],
  } = usePageProps();
  const claimantsFromRedux = useSelector(fellowshipSalaryClaimantsSelector);
  const dataSource = claimantsFromRedux || claimantsFromServer;

  return orderBy(
    dataSource.map((claimant) => {
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
}

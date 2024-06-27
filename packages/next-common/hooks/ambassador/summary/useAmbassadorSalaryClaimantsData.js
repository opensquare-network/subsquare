import { find, orderBy } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { ambassadorSalaryClaimantsSelector } from "next-common/store/reducers/ambassador/claimants";
import { useSelector } from "react-redux";

export function useAmbassadorSalaryClaimantsData() {
  const {
    ambassadorSalaryClaimants: claimantsFromServer = [],
    ambassadorMembers = [],
  } = usePageProps();
  const claimantsFromRedux = useSelector(ambassadorSalaryClaimantsSelector);
  const dataSource = claimantsFromRedux || claimantsFromServer;

  return orderBy(
    dataSource.map((claimant) => {
      const address = claimant?.address;
      const member = find(ambassadorMembers, { address });
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

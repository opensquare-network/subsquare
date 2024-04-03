import { find, orderBy } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { usePageProps } from "next-common/context/page";
import {
  fellowshipSalaryClaimantsSelector,
  fellowshipSalaryClaimantsTriggerUpdateSelector,
  fetchFellowshipSalaryClaimants,
  setFellowshipSalaryClaimants,
} from "next-common/store/reducers/fellowship/claimants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useFellowSalaryClaimantsData() {
  const { fellowshipSalaryClaimants = [], fellowshipMembers = [] } =
    usePageProps();
  const api = useContextApi();
  const dispatch = useDispatch();

  const claimants = useSelector(fellowshipSalaryClaimantsSelector);
  const triggerUpdate = useSelector(
    fellowshipSalaryClaimantsTriggerUpdateSelector,
  );

  const isFirst = triggerUpdate === 0;
  const dataSource = isFirst ? fellowshipSalaryClaimants : claimants;

  useEffect(() => {
    dispatch(setFellowshipSalaryClaimants(fellowshipSalaryClaimants));
  }, [dispatch, fellowshipSalaryClaimants]);

  useEffect(() => {
    if (!api) {
      return;
    }

    dispatch(fetchFellowshipSalaryClaimants(api));
  }, [api, triggerUpdate]);

  const data = orderBy(
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

  return data;
}

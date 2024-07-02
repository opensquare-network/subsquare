import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import {
  ambassadorMembersApiUri,
  ambassadorParamsApi,
  ambassadorSalaryClaimantsApi,
  ambassadorSalaryActiveCycleApi,
} from "next-common/services/url";
import { merge, noop } from "lodash-es";

export function withAmbassadorSalaryCommonProps(fn = noop) {
  return withCommonProps(async (context) => {
    const [
      tracksProps,
      { result: ambassadorMembers },
      { result: ambassadorParams = {} },
      { result: ambassadorSalaryClaimants = [] },
      { result: activeCycle },
    ] = await Promise.all([
      fetchOpenGovTracksProps(),
      nextApi.fetch(ambassadorMembersApiUri),
      nextApi.fetch(ambassadorParamsApi),
      nextApi.fetch(ambassadorSalaryClaimantsApi),
      nextApi.fetch(ambassadorSalaryActiveCycleApi),
    ]);

    const res = await fn?.(context);

    return merge(
      {
        props: {
          ...tracksProps,
          ambassadorMembers,
          ambassadorParams,
          ambassadorSalaryClaimants,
          activeCycle: activeCycle || {},
        },
      },
      res,
    );
  });
}

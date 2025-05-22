import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { backendApi } from "next-common/services/nextApi";
import {
  ambassadorMembersApiUri,
  ambassadorParamsApi,
  ambassadorSalaryActiveCycleApi,
  ambassadorSalaryClaimantsApi,
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
      backendApi.fetch(ambassadorMembersApiUri),
      backendApi.fetch(ambassadorParamsApi),
      backendApi.fetch(ambassadorSalaryClaimantsApi),
      backendApi.fetch(ambassadorSalaryActiveCycleApi),
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

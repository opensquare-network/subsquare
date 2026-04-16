import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { backendApi } from "next-common/services/nextApi";
import {
  secretaryMembersApiUri,
  secretarySalaryActiveCycleApi,
  secretarySalaryClaimantsApi,
} from "next-common/services/url";
import { merge, noop } from "lodash-es";

export function withSecretarySalaryCommonProps(fn = noop) {
  return withCommonProps(async (context) => {
    const [
      tracksProps,
      { result: secretaryMembers },
      { result: secretarySalaryClaimants = [] },
      { result: activeCycle },
    ] = await Promise.all([
      fetchOpenGovTracksProps(),
      backendApi.fetch(secretaryMembersApiUri),
      backendApi.fetch(secretarySalaryClaimantsApi),
      backendApi.fetch(secretarySalaryActiveCycleApi),
    ]);

    const res = await fn?.(context);

    return merge(
      {
        props: {
          ...tracksProps,
          secretaryMembers,
          secretarySalaryClaimants,
          activeCycle: activeCycle || {},
        },
      },
      res,
    );
  });
}

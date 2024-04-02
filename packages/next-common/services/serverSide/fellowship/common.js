import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import {
  fellowshipMembersApiUri,
  fellowshipParamsApi,
  fellowshipSalaryClaimantsApi,
} from "next-common/services/url";
import { merge, noop } from "lodash-es";

export function withFellowshipSalaryCommonProps(fn = noop) {
  return withCommonProps(async (context) => {
    const [
      tracksProps,
      { result: fellowshipMembers },
      { result: fellowshipParams = {} },
      { result: fellowshipSalaryClaimants },
    ] = await Promise.all([
      fetchOpenGovTracksProps(),
      nextApi.fetch(fellowshipMembersApiUri),
      nextApi.fetch(fellowshipParamsApi),
      nextApi.fetch(fellowshipSalaryClaimantsApi),
    ]);

    const res = await fn?.(context);

    return merge(
      {
        props: {
          ...tracksProps,
          fellowshipMembers,
          fellowshipParams,
          fellowshipSalaryClaimants,
        },
      },
      res,
    );
  });
}

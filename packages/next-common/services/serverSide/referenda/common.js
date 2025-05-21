import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { backendApi } from "next-common/services/nextApi";
import { gov2ReferendumsSummaryApi } from "next-common/services/url";
import { merge, noop } from "lodash-es";

export function withReferendaCommonProps(fn = noop) {
  return withCommonProps(async (context) => {
    const [tracksProps, { result: gov2ReferendaSummary }] = await Promise.all([
      fetchOpenGovTracksProps(),
      backendApi.fetch(gov2ReferendumsSummaryApi),
    ]);

    const res = await fn?.(context);

    return merge(
      {
        props: {
          title: "OpenGov Referenda",
          gov2ReferendaSummary: gov2ReferendaSummary ?? {},
          ...tracksProps,
        },
      },
      res,
    );
  });
}

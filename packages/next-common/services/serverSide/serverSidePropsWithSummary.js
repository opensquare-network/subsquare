import { withCommonProps } from "next-common/lib";
import { ssrNextApi } from "../nextApi";

export const serverSidePropsWithSummary = withCommonProps(async () => {
  const { result: summary } = await ssrNextApi.fetch("summary");
  return {
    props: {
      summary: summary ?? {},
    },
  };
});

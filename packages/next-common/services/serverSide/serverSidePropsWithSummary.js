import { withCommonProps } from "next-common/lib";
import { backendApi } from "../nextApi";

export const serverSidePropsWithSummary = withCommonProps(async () => {
  const { result: summary } = await backendApi.fetch("overview/summary");
  return {
    props: {
      summary: summary ?? {},
    },
  };
});

import { withCommonProps } from "next-common/lib";
import nextApi from "../nextApi";

export const serverSidePropsWithSummary = withCommonProps(async () => {
  const { result: summary } = await nextApi.fetch("summary");
  return {
    props: {
      summary: summary ?? {},
    },
  };
});

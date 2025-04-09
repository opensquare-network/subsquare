import { EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import TreasuryProposalsPage from "@subsquare/next/pages/treasury/proposals";

export default TreasuryProposalsPage;

export const getServerSideProps = withCommonProps(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: proposals }, { result: summary }] = await Promise.all([
    nextApi.fetch("treasury/proposals", {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
      simple: true,
    }),
    nextApi.fetch("overview/summary"),
  ]);

  return {
    props: {
      chain,
      proposals: proposals ?? EmptyList,
      summary: summary ?? {},
    },
  };
});

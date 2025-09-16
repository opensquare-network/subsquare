import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";

const defaultPageSize = 25;

const sectionMap = {
  membership: "fellowshipCore",
  salary: "fellowshipSalary",
  referenda: "fellowshipReferenda",
};

const getFellowshipFeedsServerSideProps = withCommonProps(async (context) => {
  const { page = 1, section = "", event = "", who = "" } = context.query;

  const { result: feeds } = await backendApi.fetch("fellowship/feeds", {
    page,
    pageSize: defaultPageSize,
    section: sectionMap[section] || section,
    event,
    who,
  });

  return {
    props: {
      feeds: feeds || [],
    },
  };
});

export default getFellowshipFeedsServerSideProps;

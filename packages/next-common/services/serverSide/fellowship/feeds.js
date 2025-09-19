import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { getFeedsEvent } from "next-common/utils/fellowship/getFeedsEvent";
import { sectionMap } from "next-common/utils/consts/fellowship/feeds";

const defaultPageSize = 25;

const getFellowshipFeedsServerSideProps = withCommonProps(async (context) => {
  const { page = 1, section = "", event = "", who = "" } = context.query;

  const { result: feeds } = await backendApi.fetch("fellowship/feeds", {
    page,
    pageSize: defaultPageSize,
    section: sectionMap[section] || section,
    event: getFeedsEvent(section, event),
    who,
  });

  return {
    props: {
      feeds: feeds || [],
    },
  };
});

export default getFellowshipFeedsServerSideProps;

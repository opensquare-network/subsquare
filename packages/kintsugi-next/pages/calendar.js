import { withCommonProps } from "next-common/lib";
import { adminsApi } from "next-common/services/url";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import CalendarPage from "@subsquare/next/pages/calendar";

export default CalendarPage;

export const getServerSideProps = withCommonProps(async () => {
  const { result: admins } = await nextApi.fetch(adminsApi);

  return {
    props: {
      admins: admins ?? [],
    },
  };
});

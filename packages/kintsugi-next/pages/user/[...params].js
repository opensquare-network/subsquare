import { withCommonProps } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import Profile from "next-common/components/profile";

export default Profile;

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    params: [id],
  } = context.query;

  const [{ result: userSummary }, { result: user }, { result: summary }] =
    await Promise.all([
      ssrNextApi.fetch(`users/${id}/counts`),
      ssrNextApi.fetch(`users/${id}`),
      ssrNextApi.fetch("summary"),
    ]);

  return {
    props: {
      id,
      userSummary: userSummary ?? {},
      user: user ?? {},
      route: context.query?.params?.slice(1)?.join("/") ?? "",
      summary: summary ?? {},
    },
  };
});

import { withCommonProps } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import Profile from "next-common/components/profile";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { tryConvertToSubstrateAddress } from "next-common/utils/hydradxUtil";

export default Profile;

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    params: [id],
  } = context.query;

  const maybeAddress = tryConvertToSubstrateAddress(id);

  const [{ result: userSummary }, { result: user }] = await Promise.all([
    ssrNextApi.fetch(`users/${maybeAddress}/counts`),
    ssrNextApi.fetch(`users/${maybeAddress}`),
  ]);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      id: maybeAddress,
      userSummary: userSummary ?? {},
      user: user ?? {},
      route: context.query?.params?.slice(1)?.join("/") ?? "",
      ...tracksProps,
    },
  };
});

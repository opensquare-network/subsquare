import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import Profile from "next-common/components/profile";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { tryConvertToSubstrateAddress } from "next-common/utils/mixedChainUtil";

export default Profile;

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    params: [id],
  } = context.query;

  const maybeAddress = tryConvertToSubstrateAddress(id);

  const [{ result: userSummary }, { result: user }] = await Promise.all([
    nextApi.fetch(`users/${maybeAddress}/counts`),
    nextApi.fetch(`users/${maybeAddress}`),
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

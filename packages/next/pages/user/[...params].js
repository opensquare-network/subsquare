import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import Profile from "next-common/components/profile";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchProfileTreasuryProps } from "next-common/services/serverSide/prefile/treasury";
import { tryConvertToSubstrateAddress } from "next-common/utils/mixedChainUtil";

export default Profile;

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    params: [id],
  } = context.query;

  const maybeAddress = tryConvertToSubstrateAddress(id);

  const [{ result: userSummary }, { result: user }] = await Promise.all([
    backendApi.fetch(`users/${maybeAddress}/counts`),
    backendApi.fetch(`users/${maybeAddress}`),
  ]);
  const tracksProps = await fetchOpenGovTracksProps();
  const treasuryProps = await fetchProfileTreasuryProps(maybeAddress);

  return {
    props: {
      id: maybeAddress,
      userSummary: userSummary ?? {},
      user: user ?? {},
      route: context.query?.params?.slice(1)?.join("/") ?? "",
      ...tracksProps,
      ...treasuryProps,
    },
  };
});

import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import Profile from "next-common/components/profile";
import getChainSettings from "next-common/utils/consts/settings";
import { encodeAddressToChain } from "next-common/services/address";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(Profile);

export const getServerSideProps = withLoginUser(async (context) => {
  const {
    params: [id],
  } = context.query;

  const setting = getChainSettings(process.env.CHAIN);
  const identityChain = setting.identity;
  const identityAddress = encodeAddressToChain(id, identityChain);

  const [{ result: summary }, { result: user }, { result: identity }] =
    await Promise.all([
      ssrNextApi.fetch(`users/${id}/counts`),
      ssrNextApi.fetch(`users/${id}`),
      ssrNextApi.fetch(
        `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_HOST}/${identityChain}/identity/${identityAddress}`,
      ),
    ]);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      id,
      summary: summary ?? {},
      user: user ?? {},
      route: context.query?.params?.slice(1)?.join("/") ?? "",
      ...tracksProps,
      identity: identity || {},
    },
  };
});

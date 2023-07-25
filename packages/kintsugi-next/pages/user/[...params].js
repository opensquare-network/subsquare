import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import Profile from "next-common/components/profile";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import getChainSettings from "next-common/utils/consts/settings";
import { encodeAddressToChain } from "next-common/services/address";

export default withLoginUserRedux(Profile);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const {
    params: [id],
  } = context.query;

  const setting = getChainSettings(chain);
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

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      id,
      chain,
      summary: summary ?? {},
      user: user ?? {},
      route: context.query?.params?.slice(1)?.join("/") ?? "",
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      identity: identity || {},
    },
  };
});

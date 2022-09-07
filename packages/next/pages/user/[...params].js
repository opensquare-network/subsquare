import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import React from "react";
import Profile from "next-common/components/profile";

export default withLoginUserRedux(Profile);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const {
    params: [id],
  } = context.query;

  const [{ result: summary }, { result: user }] = await Promise.all([
    nextApi.fetch(`users/${id}/counts`),
    nextApi.fetch(`users/${id}`),
  ]);

  return {
    props: {
      id,
      chain,
      summary: summary ?? {},
      user: user ?? {},
      route: context.query?.params?.slice(1)?.join("/") ?? "",
    },
  };
});

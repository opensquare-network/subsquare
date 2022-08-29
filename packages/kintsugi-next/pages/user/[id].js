import React from "react";
import { withLoginUser } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Profile from "next-common/components/profile";

export default Profile;

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id } = context.query;

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
    },
  };
});

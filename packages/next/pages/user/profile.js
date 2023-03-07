import React from "react";
import { withLoginUser } from "next-common/lib";
import { redirect, toLogin } from "next-common/utils/serverSideUtil";

export default function Profile() {
  return null;
}

const getProps = withLoginUser(async () => {
  return { props: {} };
});

export const getServerSideProps = async (context) => {
  const props = await getProps(context);
  if (props?.redirect) {
    return props;
  }

  if (props?.props?.loginUser) {
    return redirect(`/user/${props?.props?.loginUser.address}`);
  }

  return toLogin(context);
};

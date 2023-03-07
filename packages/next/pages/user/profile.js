import React from "react";
import { withLoginUser } from "next-common/lib";
import { redirect, to404, toLogin } from "next-common/utils/serverSideUtil";

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
    const userAddress = props.props.loginUser.address;
    if (userAddress) {
      return redirect(`/user/${userAddress}`);
    }

    return to404();
  }

  return toLogin(context);
};

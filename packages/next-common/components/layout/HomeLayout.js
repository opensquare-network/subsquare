import React from "react";
import BaseLayout from "./baseLayout";
import homeMenus from "../../utils/consts/menu";
import Menu from "../menu";

export default function HomeLayout({ user, children, seoInfo }) {
  return (
    <BaseLayout
      user={user}
      children={children}
      seoInfo={seoInfo}
      left={<Menu menu={homeMenus} chain={process.env.NEXT_PUBLIC_CHAIN} />}
    />
  );
}

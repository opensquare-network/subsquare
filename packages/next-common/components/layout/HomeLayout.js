import React from "react";
import BaseLayout from "./baseLayout";
import Menu from "../menu";
import homeMenus from "../../utils/consts/menu";

export default function HomeLayout({ children, seoInfo }) {
  return (
    <BaseLayout
      children={children}
      seoInfo={seoInfo}
      left={<Menu menu={homeMenus} />}
    />
  );
}

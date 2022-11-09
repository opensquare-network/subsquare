import React from "react";
import BaseLayout from "./baseLayout";
import Menu from "../menu";
import { useHomeMenus } from "../../utils/hooks/useHomeMenu";

export default function HomeLayout({ children, seoInfo }) {
  const menus = useHomeMenus();

  return (
    <BaseLayout
      children={children}
      seoInfo={seoInfo}
      left={<Menu menu={menus} chain={process.env.NEXT_PUBLIC_CHAIN} />}
    />
  );
}

import { gov2Menus } from "../../utils/consts/menu/gov2";
import Menu from "../menu";
import BaseLayout from "./baseLayout";

export default function Gov2Layout({ user, children, seoInfo }) {
  return (
    <BaseLayout
      user={user}
      children={children}
      seoInfo={seoInfo}
      left={<Menu menu={gov2Menus} chain={process.env.NEXT_PUBLIC_CHAIN} />}
    />
  );
}

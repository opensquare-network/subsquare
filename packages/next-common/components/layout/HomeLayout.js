import LayoutBase from "./layoutBase";
import homeMenus from "../../utils/consts/menu";
import Menu from "../menu";

export default function HomeLayout({ user, children, seoInfo }) {
  return (
    <LayoutBase
      user={user}
      children={children}
      seoInfo={seoInfo}
      left={<Menu menu={homeMenus} chain={process.env.NEXT_PUBLIC_CHAIN} />}
    />
  );
}

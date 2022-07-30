import LayoutBase from "./layoutBase";
import Menu from "../menu";
import { settingMenu } from "../../utils/consts/menu/settings";

export default function SettingsLayout({
  user,
  children,
  seoInfo,
  menu = settingMenu,
}) {
  return (
    <LayoutBase
      user={user}
      children={children}
      seoInfo={seoInfo}
      left={<Menu menu={menu} chain={process.env.NEXT_PUBLIC_CHAIN} />}
    />
  );
}

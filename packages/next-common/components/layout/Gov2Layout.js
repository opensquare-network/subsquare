import Menu from "../menu";
import BaseLayout from "./baseLayout";
import { composeGov2TracksMenu } from "../../utils/gov2";

export default function Gov2Layout({ user, children, seoInfo, tracks }) {
  const menu = composeGov2TracksMenu(tracks);

  return (
    <BaseLayout
      user={user}
      children={children}
      seoInfo={seoInfo}
      left={<Menu menu={menu} chain={process.env.NEXT_PUBLIC_CHAIN} />}
    />
  );
}

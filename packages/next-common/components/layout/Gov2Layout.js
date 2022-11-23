import Menu from "../menu";
import BaseLayout from "./baseLayout";
import { resolveGov2TracksMenu } from "../../utils/consts/menu/gov2";

export default function Gov2Layout({ children, seoInfo, tracks }) {
  const menu = resolveGov2TracksMenu(tracks);

  return (
    <BaseLayout
      children={children}
      seoInfo={seoInfo}
      left={<Menu menu={menu} foldable={false} />}
    />
  );
}

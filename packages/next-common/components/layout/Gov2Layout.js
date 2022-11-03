import { useGov2Menu } from "../../utils/hooks/useGov2Menu";
import Menu from "../menu";
import BaseLayout from "./baseLayout";

export default function Gov2Layout({ user, children, seoInfo }) {
  const gov2Menu = useGov2Menu();

  return (
    <BaseLayout
      user={user}
      children={children}
      seoInfo={seoInfo}
      left={<Menu menu={gov2Menu} chain={process.env.NEXT_PUBLIC_CHAIN} />}
    />
  );
}

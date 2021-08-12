import Layout from "components/layout";
import Menu from "components/menu";
import { settingMenu } from "utils/constants";
import dynamic from "next/dynamic";

const LinkedAddressComp = dynamic(() => import("components/linkedAddress"), {
  ssr: false,
});

export default function LinkedAddress() {
  return (
    <Layout left={<Menu menu={settingMenu} />}>
      <LinkedAddressComp />
    </Layout>
  );
}

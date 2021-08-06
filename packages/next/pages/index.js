import Layout from "components/layout";

import Overview from "components/overview";
import Menu from "components/menu";
import Trends from "components/trends";
import Footer from "components/footer";
import { mainMenu } from "utils/constants";

export default function Home() {
  return (
    <Layout
      left={<Menu menu={mainMenu} />}
      right={
        <>
          <Trends />
          <Footer />
        </>
      }
    >
      <Overview />
    </Layout>
  );
}

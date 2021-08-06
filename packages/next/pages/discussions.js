import { discussionData } from "utils/data";
import List from "components/list";
import Layout from "components/layout";
import Menu from "components/menu";
import Trends from "components/trends";
import Footer from "components/footer";
import { mainMenu } from "utils/constants";

export default function Discussions() {
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
      <List
        category={discussionData.category}
        items={discussionData.items}
        pagination
      />
    </Layout>
  );
}

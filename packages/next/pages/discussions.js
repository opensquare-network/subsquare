import { discussionData } from "utils/data";
import List from "components/list";
import Layout from "components/layout";

export default function Discussions() {
  return (
    <Layout>
      <List category={discussionData.category} items={discussionData.items} />
    </Layout>
  );
}

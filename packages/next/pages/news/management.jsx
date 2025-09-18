import NewsManagementPage from "next-common/components/news/newsManagementPage";
import { withCommonProps } from "next-common/lib";
export default NewsManagementPage;

export const getServerSideProps = withCommonProps(async () => {
  return {
    props: {},
  };
});

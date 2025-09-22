import NewsManagementPage from "next-common/components/news/newsManagementPage";
import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import { isPolkadotChain } from "next-common/utils/chain";
export default NewsManagementPage;

export const getServerSideProps = withCommonProps(async () => {
  if (!isPolkadotChain(CHAIN)) {
    return {
      redirect: {
        permanent: true,
        destination: "/404",
      },
    };
  }
  return {
    props: {},
  };
});

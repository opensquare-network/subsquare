import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";

const isStakingSupported = !!getChainSettings(CHAIN).modules?.staking;

export default function NominationPoolsPage() {
  if (!isStakingSupported) {
    return null;
  }

  return (
    <ListLayout
      title={"Nomination Pools"}
      seoInfo={{ title: "" }}
      description={
        "Displays and manages nomination pools, allowing users to view, join, and track their staking pools."
      }
      summary={null}
    ></ListLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isStakingSupported) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    return {
      props: {},
    };
  })(ctx);
};

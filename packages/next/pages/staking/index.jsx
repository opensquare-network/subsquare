import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";

const isStakingSupported = !!getChainSettings(CHAIN).modules?.staking;

export default function StakingPage() {
  if (!isStakingSupported) {
    return null;
  }

  return (
    <ListLayout
      title={"Overview"}
      seoInfo={{ title: "" }}
      description={"An overview of your staking status, rewards."}
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
